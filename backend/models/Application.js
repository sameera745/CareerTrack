const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    applicationDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Applied",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
