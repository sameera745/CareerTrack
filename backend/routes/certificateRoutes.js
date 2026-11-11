
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const Certificate = require("../models/Certificate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const allowedMimeTypes = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomUUID() + extension);
  },
});

const upload = multer({
  storage,
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
    try {
      const { certificateName, issuingOrganization } = req.body;

      if (!certificateName || !issuingOrganization) {
        if (req.file) await fs.promises.unlink(req.file.path);

        return res.status(400).json({
          message: "Certificate name and issuing organization are required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Certificate file is required.",
        });
      }

      // Inspect the actual file contents
      const { fileTypeFromFile } = await import("file-type");
      const detectedType = await fileTypeFromFile(req.file.path);

      const extension = path.extname(req.file.originalname).toLowerCase();

      const isValid =
        detectedType &&
        allowedMimeTypes[detectedType.mime] &&
        allowedMimeTypes[detectedType.mime].includes(extension);

      if (!isValid) {
        await fs.promises.unlink(req.file.path);

        return res.status(400).json({
          message: "File contents do not match an allowed certificate format.",
        });
      }

      const certificate = new Certificate({
        certificateName,
        issuingOrganization,
        fileName: req.file.originalname,
        filePath: req.file.path,
        owner: req.userId,
      });

      const savedCertificate = await certificate.save();

      res.status(201).json(savedCertificate);
    } catch (error) {
      console.error("Certificate upload error:", error);

      if (req.file && fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path);
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

    res.download(filePath, certificate.fileName);
  } catch (error) {
    console.error("Certificate download error:", error);

    res.status(500).json({
      message: "Failed to download certificate",
    });
  }
});

module.exports = router;
