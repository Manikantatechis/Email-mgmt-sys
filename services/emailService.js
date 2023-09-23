const nodemailer = require("nodemailer");
const crypto = require("crypto");

const MAX_RETRIES = 3;  // Number of times to retry sending
const RETRY_DELAY = 5000;  // Delay between retries in milliseconds (5 seconds)

function generateEmail({ Name, Email },gmailCredentials, gmailTemplate, batchId) {
    const trackingId = crypto.createHash("sha256").update(`${batchId}-${Email}`).digest("hex");
    const trackingPixel = `<img src="${process.env.BACKEND_URL}/api/track?trackingId=${trackingId}" width="1" height="1" alt="" crossorigin="anonymous"/>`;

    const subject = gmailTemplate.subject;
    let emailBody;

    if (gmailTemplate.type === "html") {
        emailBody = (gmailTemplate.html || "").replace(/\$\{name\}/g, Name) + trackingPixel;
    } else {
        emailBody = (gmailTemplate.content || "").replace(/\$\{name\}/g, Name);
    }

    const mailOptions = {
        from: gmailCredentials.email,
        to: Email,
        subject,
    };

    if (gmailTemplate.type === "html") {
        mailOptions.html = emailBody;
    } else {
        mailOptions.text = emailBody;
    }

    if (gmailTemplate.cc && gmailTemplate.cc.length > 0) {
        mailOptions.cc = gmailTemplate.cc.join(", ");
    }

    if (gmailTemplate.bcc && gmailTemplate.bcc.length > 0) {
        mailOptions.bcc =gmailTemplate.bcc.join(", ");
    }

    return mailOptions;
}

async function sendIndividualEmail(transporter, mailOptions) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            await transporter.sendMail(mailOptions);
            return { to: mailOptions.to, status: "Success" };
        } catch (error) {
            console.error(`Email Error (Attempt ${attempt + 1}):`, error);
            if (attempt < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }
    return { to: mailOptions.to, status: "Failed", reason: "Max retries reached." };
}

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

    const emailPromises = tableData.map(data => {
        const mailOptions = generateEmail(data,gmailCredentials, gmailTemplate, batchId);
        return sendIndividualEmail(transporter, mailOptions);
    });

    return await Promise.allSettled(emailPromises);
}

module.exports = sendEmail;
