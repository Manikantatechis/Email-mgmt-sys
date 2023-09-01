const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const XLSX = require("xlsx");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

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
	form.append("userid", process.env.USER_ID);
	form.append("userId", process.env.USER_ID);
	form.append("apiKey", process.env.API_KEY); // Use the environment variable


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
