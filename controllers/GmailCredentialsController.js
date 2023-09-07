const GmailCredentials = require("../models/gmailCredModel");
const asyncHandler = require("express-async-handler")

const addGmailCredentials = asyncHandler(async (req, res) => {
	const { role, userId } = req;

	if (role !== "manager" && role !== "director") {
		res.status(403)
		throw new Error({ message: "You don't have permission to perform this action" });
	}
	const { email, oauthClientId, oauthClientSecret, oauthRefreshToken } = req.body;
	if (!email || !oauthClientId || !oauthClientSecret || !oauthRefreshToken) {
		res.status(400);
		throw new Error("please enter all the credentials");
	}
	try {
		const newCredentials = new GmailCredentials({
			email,
			oauthClientId,
			oauthClientSecret,
			oauthRefreshToken,
			userId,
		});

		await newCredentials.save();

		res.status(201).json({ message: "Successfully added" });
	} catch (error) {
		res.status(500)
		throw new Error(error.message);
	}
});

const editGmailCredentials = asyncHandler(async (req, res) => {
	const { role } = req;

	if (role !== "manager" && role !== "director") {
		return res.status(403)
		throw new Error({ message: "You don't have permission to perform this action" });
	}

	const { status } = req.body;

	try {
		const updatedCredentials = await GmailCredentials.findByIdAndUpdate(req.params.id, status, { new: true });

		if (!updatedCredentials) {
			return res.status(404).json({ message: "GmailCredentials not found" });
		}

		res.status(200).json({ message: "Successfully updated" });
	} catch (error) {
		res.status(500)
		throw new Error(error.message);
	}
});

const listGmailCredentials = asyncHandler(async (req, res) => {
	const { role } = req;

	if (role !== "manager" && role !== "director") {
		res.status(403)
		throw new Error({ message: "You don't have permission to perform this action" });
	}

	try {
		const credentials = await GmailCredentials.find({}).select("_id email status").lean();
		res.status(200).json(credentials);
	} catch (error) {
		res.status(500)
		throw new Error(error.message);
	}
});

const listGmailEmails = asyncHandler(async (req, res) => {
	try {
		const credentials = await GmailCredentials.find({}).select("_id email").lean();

		res.status(200).json(credentials);
	} catch (error) {
		res.status(500)
		throw new Error(error.message);
	}
});

module.exports = { listGmailEmails, listGmailCredentials, editGmailCredentials, addGmailCredentials };
