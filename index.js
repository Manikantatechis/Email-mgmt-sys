const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const XLSX = require("xlsx");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3000;

let count = 0;

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

// Serve static HTML file
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

// Function to send SMS
async function sendSMS(row) {
	const name = row["Name"];
	const phoneNumber = row["Phone Number"].toString();

	const form = new FormData();
	form.append("call", "sendsms");
	form.append("businessid", process.env.BUSINESS_ID);
	form.append("businessId", process.env.BUSINESS_ID);
	form.append("userid", process.env.USER_ID); // Use the environment variable
	form.append("userId", process.env.USER_ID); // Use the environment variable
	form.append("apiKey", process.env.API_KEY); // Use the environment variable
	form.append("number", `+1${phoneNumber}`);
	form.append(
		"message",
		`Hi ${name}, We noticed you recently expressed interest in our cutting-edge Software Development program at TECH IS. We're thrilled about your enthusiasm!

Would you be open to a brief 10-15 minute conversation to explore how this program could accelerate your career in tech? We're confident that our program offers unique benefits that you won't want to miss.

To make it easy for you, here's a Google Meet link [https://meet.google.com/foi-bmch-dtq]  for a virtual meeting. Feel free to click on it at a time that's convenient for you, or let us know when you're available.

Looking forward to your positive response.

Best regards,
TECH IS
        `
	);

	try {
		const response = await axios.post("https://apig.kixie.com/itn/sendmms", form, {
			headers: {
				...form.getHeaders(),
			},
		});
		count += 1;
		console.log(`Successfully sent SMS to ${name} at ${phoneNumber}: `, "sent =", response.data, " count is :", count);
	} catch (error) {
		console.log(`Failed to send SMS to ${name} at ${phoneNumber}: `, error);
	}
}

// Handle file upload
app.post("/upload", upload.single("sampleFile"), async (req, res) => {
	const filePath = req.file.path;
	const workbook = XLSX.readFile(filePath);
	const sheet_name_list = workbook.SheetNames;
	const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

	for (let row of data) {
		await sendSMS(row); // Wait for the SMS to be sent before moving to the next row
	}

	res.send("Total SMS sent is " + count);
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
