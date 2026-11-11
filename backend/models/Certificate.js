
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateName: {
      type: String,
      required: true,
    },
    issuingOrganization: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },

    // Used for older certificates stored locally
    filePath: {
      type: String,
      required: false,
    },

    // Used for certificates stored in Cloudinary
    cloudinaryPublicId: {
      type: String,
      required: false,
    },
    cloudinaryResourceType: {
      type: String,
      required: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);
