
const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET applications belonging to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      owner: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);

    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
});

// POST a new application
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { company, position, applicationDate } = req.body;

    // Validate required fields
    if (!company || !position || !applicationDate) {
      return res.status(400).json({
        message: "Company, position, and application date are required",
      });
    }

    // Create application with logged-in user's ID
    const newApplication = new Application({
      company,
      position,
      applicationDate,
      owner: req.userId,
    });

    // Save application in MongoDB
    const savedApplication = await newApplication.save();

    res.status(201).json({
      message: "Application created successfully",
      application: savedApplication,
    });

  } catch (error) {
    console.error("Create application error:", error);

    res.status(500).json({
      message: "Failed to create application",
      error: error.message,
    });
  }
});

module.exports = router;
