const asyncHandler = require("express-async-handler");
const GmailTemplate = require("../models/gmailTemplateModel"); // Replace with the actual path to your model

const addGmailTemplate = asyncHandler(async (req, res, next) => {
	const { role, userId } = req;
	console.log(role)
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const { name, status, type, content, html } = req.body;
	if (!name || !status || !type || (!content && !html)) {
		throw new Error("Missing required fields");
	}

	const newTemplate = new GmailTemplate({
		name,
		userId,
		status,
		type,
		content,
		html,
	});

	await newTemplate.save();
	res.status(201).json(newTemplate);
});

const listGmailTemplates = asyncHandler(async (req, res, next) => {
	const { role } = req;
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const templates = await GmailTemplate.find();
	res.status(200).json(templates);
});

// Function to retrieve a specific Gmail template by ID
const getTemplateNames = asyncHandler(async (req, res) => {
	const template = await GmailTemplate.find({}).select("_id name");

	if (!template) {
		return res.status(404).json({ error: "Template not found" });
	}

	res.status(200).json(template);
});

const editGmailTemplate = asyncHandler(async (req, res, next) => {
	const { role, userId } = req;
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const { id } = req.params; // Template ID from URL
	const updates = req.body;

	const template = await GmailTemplate.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
	if (!template) {
		throw new Error("GMAIL Template not found");
	}

	res.status(200).json(template);
});

const deleteGmailTemplate = asyncHandler(async (req, res, next) => {
	const { role, userId } = req;
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const { id } = req.params; // Template ID from URL

	const template = await GmailTemplate.findOneAndDelete({ _id: id, userId });
	if (!template) {
		throw new Error("GMAIL Template not found");
	}

	res.status(200).json({ message: "GMAIL Template deleted" });
});

module.exports = { addGmailTemplate, listGmailTemplates, editGmailTemplate, deleteGmailTemplate, getTemplateNames };
