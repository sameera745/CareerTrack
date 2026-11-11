
const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const Certificate = require("../models/Certificate");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

const allowedMimeTypes = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

// Store uploaded files temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes[file.mimetype] ||
      !allowedMimeTypes[file.mimetype].includes(extension)
    ) {
      return cb(
        new Error("Only PDF, JPG, JPEG, and PNG files are allowed.")
      );
    }

    cb(null, true);
  },
});

// Upload a validated file buffer to Cloudinary
const uploadToCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        type: "authenticated",
        public_id: publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

// GET certificates belonging to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const certificates = await Certificate.find({
      owner: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(certificates);
  } catch (error) {
    console.error("Fetch certificates error:", error);

    res.status(500).json({
      message: "Failed to fetch certificates",
    });
  }
});

// POST a certificate for the logged-in user
router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    upload.single("certificateFile")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        const message =
          error.code === "LIMIT_FILE_SIZE"
            ? "File size must not exceed 5 MB."
            : error.message;

        return res.status(400).json({ message });
      }

      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    let uploadedPublicId;

    try {
      const { certificateName, issuingOrganization } = req.body;

      if (!certificateName || !issuingOrganization) {
        return res.status(400).json({
          message: "Certificate name and issuing organization are required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Certificate file is required.",
        });
      }

      // Validate the actual file contents
      const { fileTypeFromBuffer } = await import("file-type");
      const detectedType = await fileTypeFromBuffer(req.file.buffer);

      const extension = path.extname(req.file.originalname).toLowerCase();

      const isValid =
        detectedType &&
        allowedMimeTypes[detectedType.mime] &&
        allowedMimeTypes[detectedType.mime].includes(extension) &&
        detectedType.mime === req.file.mimetype;

      if (!isValid) {
        return res.status(400).json({
          message: "File contents do not match an allowed certificate format.",
        });
      }

      const publicId =
        `certificates/${crypto.randomUUID()}${extension}`;

      // Upload as a private authenticated raw asset
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        publicId
      );

      uploadedPublicId = cloudinaryResult.public_id;

      const certificate = new Certificate({
        certificateName,
        issuingOrganization,
        fileName: req.file.originalname,
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinaryResourceType: "raw",
        owner: req.userId,
      });

      const savedCertificate = await certificate.save();

      res.status(201).json(savedCertificate);
    } catch (error) {
      console.error("Certificate upload error:", error);

      // Remove the Cloudinary file if saving its database record fails
      if (uploadedPublicId) {
        try {
          await cloudinary.uploader.destroy(uploadedPublicId, {
            resource_type: "raw",
            type: "authenticated",
          });
        } catch (cleanupError) {
          console.error("Cloudinary cleanup error:", cleanupError);
        }
      }

      res.status(500).json({
        message: "Failed to upload certificate",
      });
    }
  }
);

// Download only certificates belonging to the logged-in user
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    // Support older certificates stored on the local server
    if (certificate.filePath) {
      const fs = require("fs");
      const filePath = path.resolve(certificate.filePath);
      const uploadsDirectory = path.resolve("uploads");

      if (!filePath.startsWith(uploadsDirectory + path.sep)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          message: "Certificate file not found",
        });
      }

      return res.download(filePath, certificate.fileName);
    }

    if (!certificate.cloudinaryPublicId) {
      return res.status(404).json({
        message: "Certificate file not found",
      });
    }

    const extension = path.extname(certificate.fileName).toLowerCase().slice(1);

    const downloadUrl = cloudinary.utils.private_download_url(
      certificate.cloudinaryPublicId,
      extension,
      {
        resource_type: "raw",
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 300,
      }
    );

    return res.redirect(downloadUrl);
  } catch (error) {
    console.error("Certificate download error:", error);

    res.status(500).json({
      message: "Failed to download certificate",
    });
  }
});

module.exports = router;
