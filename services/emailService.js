const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function sendEmail(gmailCredentials, gmailTemplate, tableData, batchId) {
  // Create the email transporter
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
    // Create a tracking ID for each email
    const trackingId = crypto.createHash("sha256").update(`${batchId}-${Email}`).digest("hex");
    const trackingPixel = `<img src="http://localhost:8000/api/track?trackingId=${trackingId}" width="1" height="1" alt="" crossorigin="anonymous"/>`;

    // Generate the email subject and body based on the template type
    const subject = gmailTemplate.subject;
    let emailBody;

    if (gmailTemplate.type === "html") {
      emailBody = (gmailTemplate.html || "").replace(/\$\{name\}/g, Name) + trackingPixel;
    } else {
      emailBody = (gmailTemplate.content || "").replace(/\$\{name\}/g, Name);
    }

    // Initialize the email options with mandatory fields
    const mailOptions = {
      from: gmailCredentials.email,
      to: Email,
      subject,
    };

    // Add either text or HTML content to the email based on the template type
    if (gmailTemplate.type === "html") {
      mailOptions.html = emailBody;
    } else {
      mailOptions.text = emailBody;
    }

    // Conditionally add 'cc' and 'bcc' if they exist in the template
    if (gmailTemplate.cc && gmailTemplate.cc.length > 0) {
      mailOptions.cc = gmailTemplate.cc.join(", ");
    }

    if (gmailTemplate.bcc && gmailTemplate.bcc.length > 0) {
      mailOptions.bcc =gmailTemplate.bcc.join(", ");
    }

    // Send the email
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
