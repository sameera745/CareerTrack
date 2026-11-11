
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
    filePath: {
      type: String,
      required: true,
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
