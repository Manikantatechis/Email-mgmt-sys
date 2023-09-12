// Import required modules
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// Import your models
const KixieCredentials = require("../models/kixieCredModel");
const KixieTemplate = require("../models/kixieTemplateModel");
const GmailCredentials = require("../models/gmailCredModel");
const GmailTemplate = require("../models/gmailTemplateModel");
const EmailBatch = require("../models/emailModel");

// Controller function
const sendMessages = asyncHandler(async (req, res) => {
	const {
		userId,
		body: { actionType, actionData, tableData },
	} = req;
	const { emailCredId, emailTemplateId, kixieCredId, kixieTemplateId } = actionData;
	if (actionType === "email") {
		if (!emailCredId || !emailTemplateId) {
			throw new Error("Missing required email actionData fields");
		}
	} else if (actionType === "sms") {
		if (!kixieCredId || !kixieTemplateId) {
			throw new Error("Missing required SMS actionData fields");
		}
	} else if (actionType === "both") {
		if (!emailCredId || !emailTemplateId || !kixieCredId || !kixieTemplateId) {
			throw new Error("Missing required actionData fields for both email and SMS");
		}
	} else {
		throw new Error("Invalid actionType provided");
	}

	// Generate batchId
	const batchTime = new Date().toISOString();
	const batchId = crypto.createHash("sha256").update(`${userId}-${batchTime}`).digest("hex");

	const newBatch = new EmailBatch({
		_id: batchId,
		userId,
		timestamp: batchTime,
		emailCount: tableData.length,
	});

	const savedBatch = await newBatch.save();
	if (!savedBatch) {
		throw new Error("Failed to save email batch");
	}

	let smsSummary = [];
	let emailSummary = [];

	if (actionType === "sms" || actionType === "both") {
		const kixieCredentials = await KixieCredentials.findById(kixieCredId);

		if (!kixieCredentials) {
			throw new Error("Kixie Credentials not found");
		}

		const kixieTemplate = await KixieTemplate.findById(kixieTemplateId);

		if (!kixieTemplate) {
			throw new Error("Kixie Template not found");
		}

		const smsPromises = tableData.map(async ({ name, phone }) => {
			const form = new FormData();
			const formData = {
				call: "sendsms",
				businessid: kixieCredentials.businessId,
				userid: kixieCredentials.kixieUserId,
				apiKey: kixieCredentials.apiKey,
			};

			Object.keys(formData).forEach((key) => form.append(key, formData[key]));

			const personalizedMessage = kixieTemplate.content.replace(/\$\{name\}/g, name);
			form.append("number", `+1${phone}`);
			form.append("message", personalizedMessage);

			return axios.post("https://apig.kixie.com/itn/sendmms", form, { headers: { ...form.getHeaders() } });
		});

		const smsResults = await Promise.allSettled(smsPromises);

		// Update SMS summary based on the outcomes
		smsResults.forEach((result, index) => {
			const { name, phone } = tableData[index];
			if (result.status === "fulfilled") {
				smsSummary.push({ name, phone, status: "Success" });
			} else {
				smsSummary.push({ name, phone, status: "Failed", reason: result.reason });
			}
		});
	}

	if (actionType === "email" || actionType === "both") {
		const gmailCredentials = await GmailCredentials.findById(emailCredId);

		if (!gmailCredentials) {
			throw new Error("Gmail Credentials not found");
		}

		const gmailTemplate = await GmailTemplate.findById(emailTemplateId);

		if (!gmailTemplate) {
			throw new Error("Gmail Template not found");
		}

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				...gmailCredentials,
			},
		});

		const emailPromises = tableData.map(async ({ name, email }) => {
			const trackingId = crypto.createHash("sha256").update(`${batchId}-${email}`).digest("hex");
			const trackingPixel = `<img src="https://yourServer.com/track?trackingId=${trackingId}" width="1" height="1" alt="" />`;
			const personalizedHtml = gmailTemplate.content.replace(/\$\{name\}/g, name) + trackingPixel;

			const mailOptions = {
				from: gmailCredentials.email,
				to: email,
				subject: "Your Subject Here",
				html: personalizedHtml,
			};

			return transporter.sendMail(mailOptions);
		});

		const emailResults = await Promise.allSettled(emailPromises);

		// Update email summary based on the outcomes
		emailResults.forEach((result, index) => {
			const { name, email } = tableData[index];
			if (result.status === "fulfilled") {
				emailSummary.push({ name, email, status: "Success" });
			} else {
				emailSummary.push({ name, email, status: "Failed", reason: result.reason });
			}
		});
	}
	const summary = {
		batchId,
		smsSummary,
		emailSummary,
	};

	// Send the summary report to the frontend
	res.status(200).json(summary);
});

module.exports = {sendMessages};
