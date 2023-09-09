const asyncHandler = require("express-async-handler");
const KixieTemplate = require("../models/kixieTemplateModel");

// Function to create a new Kixie template
exports.createTemplate = asyncHandler(async (req, res) => {
	const { userId, role } = req;

	// Check if the user has the required role (manager or director)
	if (role !== "manager" && role !== "director") {
		return res.status(403).json({ error: "Access denied. Only manager and director can perform this action." });
	}

	const { name, content, status, type } = req.body;

	const template = new KixieTemplate({
		name,
		userId,
		content,
		status,
		type,
	});

	const savedTemplate = await template.save();
	res.status(201).json({ _id: savedTemplate._id, name: savedTemplate.name, content: savedTemplate.content, status:savedTemplate.status});
});

// Function to retrieve all Kixie templates
exports.getAllTemplates = asyncHandler(async (req, res) => {
	const {role } = req;

	// Check if the user has the required role (manager or director)
	if (role !== "manager" && role !== "director") {
		return res.status(403).json({ error: "Access denied. Only manager and director can perform this action." });
	}

	const templates = await KixieTemplate.find({}).select("_id name content status");
	res.status(200).json(templates);
});

// Function to retrieve a specific Kixie template by ID
exports.getTemplateNames = asyncHandler(async (req, res) => {
	const template = await KixieTemplate.findById({}).select("_id name");

	if (!template) {
		return res.status(404).json({ error: "Template not found" });
	}

	res.status(200).json(template);
});

// Function to update a specific Kixie template by ID
exports.updateTemplate = asyncHandler(async (req, res) => {
	const { userId, role } = req;

	// Check if the user has the required role (manager or director)
	if (role !== "manager" && role !== "director") {
		return res.status(403).json({ error: "Access denied. Only manager and director can perform this action." });
	}

	const { name, content, status, type } = req.body;

	const updatedTemplate = await KixieTemplate.findByIdAndUpdate(
		req.params.templateId,
		{
			name,
			content,
			status,
			type,
		},
		{ new: true }
	);

	if (!updatedTemplate) {
		return res.status(404).json({ error: "Template not found" });
	}

	res.status(200).json(updatedTemplate);
});

// Function to delete a specific Kixie template by ID
exports.deleteTemplate = asyncHandler(async (req, res) => {
	const { userId, role } = req;

	// Check if the user has the required role (manager or director)
	if (role !== "manager" && role !== "director") {
		return res.status(403).json({ error: "Access denied. Only manager and director can perform this action." });
	}

	const deletedTemplate = await KixieTemplate.findByIdAndDelete(req.params.templateId);

	if (!deletedTemplate) {
		return res.status(404).json({ error: "Template not found" });
	}

	res.status(204).send();
});
