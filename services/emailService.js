const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function sendEmail(gmailCredentials, gmailTemplate, tableData, batchId) {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: gmailCredentials.email,
			clientId: gmailCredentials.oauthClientId,
			clientSecret: gmailCredentials.oauthClientSecret,
			refreshToken: gmailCredentials.oauthRefreshToken,
		},
	});

	const emailPromises = tableData.map(async ({ Name, Email }) => {
		const trackingId = crypto.createHash("sha256").update(`${batchId}-${Email}`).digest("hex");
		const trackingPixel = `<img src="http://localhost:8000/api/track?trackingId=${trackingId}" width="1" height="1" alt="" crossorigin="anonymous"/>`;
		const personalizedHtml = gmailTemplate.html.replace(/\$\{name\}/g, Name) + trackingPixel;

		const mailOptions = {
			from: gmailCredentials.email,
			to: Email,
			bcc: "gowtham@techis.io",
			subject: "Interview with TECH I.S. for the software developer program",
			html: personalizedHtml,
		};

		try {
			await transporter.sendMail(mailOptions);
			return { Name, Email, status: "Success" };
		} catch (error) {
			console.error("Email Error:", error);
			return { Name, Email, status: "Failed", reason: error.message };
		}
	});

	return await Promise.allSettled(emailPromises);
}

module.exports = sendEmail;
