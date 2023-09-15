const crypto = require("crypto");

function encrypt(text) {
	const algorithm = "aes-256-ctr";
	const secretKey = "your-secret-key";
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
	return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
	const algorithm = "aes-256-ctr";
	const secretKey = "your-secret-key";
	const [iv, encryptedText] = text.split(":").map((part) => Buffer.from(part, "hex"));

	const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
	const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
	return decrypted.toString();
}

// Your email sending code here...

// // Your email sending code here...
// Now, before sending the email, encrypt the necessary data:

// javascript
// Copy code
// const trackingData = JSON.stringify({ userId, presentTime, templateId, email });
// const encryptedTrackingData = encrypt(trackingData);

// const trackingPixel = `<img src="https://yourServer.com/track?data=${encryptedTrackingData}" width="1" height="1" alt="" />`;

// // Finally, update your tracking server to decrypt the data and update the database:

// const express = require("express");
// const app = express();
// const port = 3000;

// app.get("/track", async (req, res) => {
// 	const encryptedData = req.query.data;

// 	if (encryptedData) {
// 		// Decrypt the tracking data
// 		const decryptedData = decrypt(encryptedData);
// 		const trackingInfo = JSON.parse(decryptedData);

// 		// Log the decrypted data and timestamp
// 		console.log(`Email opened with tracking Info: ${JSON.stringify(trackingInfo)} at ${new Date().toISOString()}`);

// 		// Now update your database here with trackingInfo
// 		// await yourDatabase.update(....);
// 	}

// 	// Send the 1x1 pixel as before...
// });

// app.listen(port, () => {
// 	console.log(`Tracking server listening at http://localhost:${port}`);
// });

// a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6





// const express = require("express");
// const app = express();
// const port = 3000;

// app.get("/track", (req, res) => {
// 	const trackingId = req.query.trackingId;

// 	if (trackingId) {
// 		// Log the tracking ID, timestamp, and any other needed info to your database.
// 		console.log(`Email opened with tracking ID: ${trackingId} at ${new Date().toISOString()}`);

// 		// Do the database logging here
// 		// ...
// 	}

// 	// Send a 1x1 pixel image to the client.
// 	const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
// 	res.writeHead(200, {
// 		"Content-Type": "image/gif",
// 		"Content-Length": pixel.length,
// 	});
// 	res.end(pixel);
// });

// app.listen(port, () => {
// 	console.log(`Tracking server listening at http://localhost:${port}`);
// });

// // //
