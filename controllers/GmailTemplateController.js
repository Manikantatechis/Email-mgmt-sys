const asyncHandler = require("express-async-handler");
const HtmlTemplate = require("../models/htmlTemplateModel"); // Replace with the actual path to your model

exports.addHtmlTemplate = asyncHandler(async (req, res, next) => {
	const { role, userId } = req;
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const { name, status, type, content, html } = req.body;
	if (!name || !status || !type || (!content && !html)) {
		throw new Error("Missing required fields");
	}

	const newTemplate = new HtmlTemplate({
		name,
		userId,
		status,
		type,
		content,
		html,
	});

	await newTemplate.save();
	res.status(201).json({ message: "HTML Template created", data: newTemplate });
});

exports.listHtmlTemplates = asyncHandler(async (req, res, next) => {
	const { role } = req;
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const templates = await HtmlTemplate.find();
	res.status(200).json({ data: templates });
});

exports.editHtmlTemplate = asyncHandler(async (req, res, next) => {
	const { role, userId } = req;
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const { id } = req.params; // Template ID from URL
	const updates = req.body;

	const template = await HtmlTemplate.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
	if (!template) {
		throw new Error("HTML Template not found");
	}

	res.status(200).json({ message: "HTML Template updated", data: template });
});

exports.deleteHtmlTemplate = asyncHandler(async (req, res, next) => {
	const { role, userId } = req;
	if (role !== "manager" && role !== "director") {
		throw new Error("Access forbidden: insufficient role");
	}

	const { id } = req.params; // Template ID from URL

	const template = await HtmlTemplate.findOneAndDelete({ _id: id, userId });
	if (!template) {
		throw new Error("HTML Template not found");
	}

	res.status(200).json({ message: "HTML Template deleted", data: template });
});
