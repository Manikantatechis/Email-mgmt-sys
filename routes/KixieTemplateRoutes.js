const express = require("express");
const router = express.Router();
const { createTemplate, getAllTemplates, getTemplateNames, updateTemplate, deleteTemplate } = require("../controllers/KixieTemplateController");
const authMiddleware = require("../middlewares/authMiddleware"); // Replace with your authentication middleware

// Middleware to authenticate users before accessing these routes
router.use(authMiddleware);

// Create a new Kixie template
router.post("/add", createTemplate);

// Get all Kixie templates
router.get("/list", getAllTemplates);

// Get a specific Kixie template by ID
router.get("/names", getTemplateNames);

// Update a specific Kixie template by ID
router.put("/edit/:templateId", updateTemplate);

// Delete a specific Kixie template by ID
router.delete("/delete/:templateId", deleteTemplate);

module.exports = router;
