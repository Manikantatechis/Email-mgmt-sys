const KixieCredentials = require("../models/kixieCredModel");
const asyncHandler = require("express-async-handler")

// Function to add new KixieCredentials
exports.addKixieCredentials = asyncHandler(async (req, res) => {
	const { role, userId } = req; // Assuming role and userId are added to req.user after JWT authentication

	if (role !== "manager" && role !== "director") {
		return res.status(403).json({ message: "You don't have permission to perform this action" });
	}

	const { name, phone, kixieUserId, apiKey, status, businessId } = req.body;

	if (!name || !phone || !kixieUserId || !apiKey || !businessId) {
		res.status(400);
		throw new Error("pease enter all the necessary fields");
	}
	try {
		const newCredentials = new KixieCredentials({
			name,
			phone,
			kixieUserId,
			apiKey,
			status,
			businessId,
			userId,
		});

		await newCredentials.save();

		res.status(201).json({ message: "Successfully added" });
	} catch (error) {
		res.status(500)
		throw new Error({ message: "Internal Server Error", error });
	}
});

// Function to edit KixieCredentials (only status can be changed)
exports.editKixieCredentials = asyncHandler(async (req, res) => {
	const { role } = req;

	if (role !== "manager" && role !== "director") {
		return res.status(403).json({ message: "You don't have permission to perform this action" });
	}

	try {
		const updatedCredentials = await KixieCredentials.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
		if (!updatedCredentials) {
			return res.status(404).json({ message: "KixieCredentials not found" });
		}

		res.status(200).json({ message: "Successfully updated" });
	} catch (error) {
		res.status(500)
		throw new Error(error.message);
	}
});

// Function to list KixieCredentials
exports.listKixieCredentials = asyncHandler(async (req, res) => {
	const { role } = req;

	if (role !== "manager" && role !== "director") {
		return res.status(403).json({ message: "You don't have permission to perform this action" });
	}

	try {
		const credentials = await KixieCredentials.find({}).select("_id name phone").lean();

		res.status(200).json(credentials);
	} catch (error) {
		res.status(500)
		throw new Error(error.message);
	}
});

exports.listKixieNames = asyncHandler(async (req, res) => {
	try {
		const credentials = await KixieCredentials.find({}).select("_id name").lean();
		res.status(200).json(credentials);
	} catch (error) {
		res.status(500)
		throw new Error(error.message);
	}
});
