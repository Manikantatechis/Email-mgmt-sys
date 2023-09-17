const asyncHandler = require("express-async-handler");
const KixieTemplate = require("../models/kixieTemplateModel");

// Middleware to check if the user is manager or director
const checkRole = (req, res, next) => {
    const { role } = req;
    if (role !== "manager" && role !== "director") {
        return res
            .status(403)
            .json({
                error: "Access denied. Only manager and director can perform this action.",
            });
    }
    next();
};

// Helper function to find templates
const findTemplates = async (userId, fields) => {
    return await KixieTemplate.find({
        $or: [
            { userId, template_type: "personal" },
            { template_type: "global" },
        ],
    }).select(fields);
};

exports.createTemplate = asyncHandler(async (req, res, next) => {
    const { userId, role } = req;

    const { name, content, status } = req.body;
    let {template_type} = req.body
    if (role !== "manager" || role !== "director" || !template_type) {
        template_type = "personal";
    }

	console.log(template_type)

    const template = new KixieTemplate({
        name,
        userId,
        content,
        status,
        template_type,
    });
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
});

exports.getAllTemplates = asyncHandler(async (req, res) => {
    const { userId } = req;
    const templates = await findTemplates(userId, "_id name content status");
    res.status(200).json(templates);
});

exports.getTemplateNames = asyncHandler(async (req, res) => {
    const { userId } = req;
    const templates = await findTemplates(userId, "_id name");

    if (!templates.length) {
        return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json(templates);
});

exports.updateTemplate = asyncHandler(async (req, res) => {
    checkRole(req, res);

    const { name, content, status, type } = req.body;
    const updatedTemplate = await KixieTemplate.findByIdAndUpdate(
        req.params.templateId,
        { name, content, status, type },
        { new: true }
    );

    if (!updatedTemplate) {
        return res.status(404).json({ error: "Template not found" });
    }
    res.status(200).json(updatedTemplate);
});

exports.deleteTemplate = asyncHandler(async (req, res) => {
    checkRole(req, res);

    const deletedTemplate = await KixieTemplate.findByIdAndDelete(
        req.params.templateId
    );

    if (!deletedTemplate) {
        return res.status(404).json({ error: "Template not found" });
    }
    res.status(204).send();
});
