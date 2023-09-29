const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { encrypt } = require("../utils/encrytpAndDecryptText");
const EmailBatch = require("../models/emailModel");

const MAX_RETRIES = 3; // Number of times to retry sending
const RETRY_DELAY = 5000; // Delay between retries in milliseconds (5 seconds)

function generateEmail(
  { Name, Email },
  gmailCredentials,
  gmailTemplate,
  batchId
) {
  const trackingData = JSON.stringify({ batchId, Email, Name });
  const encryptedTrackingData = encrypt(trackingData);
  // console.log(`http://localhost:5183/api/track?data=${encryptedTrackingData}`)
  const trackingPixel = `<img src="${process.env.BACKEND_URL}/api/track?data=${encryptedTrackingData}" width="1" height="1" alt="" crossorigin="anonymous"/>`;

  // console.log(
  //   `${process.env.BACKEND_URL}/api/track?data=${encryptedTrackingData}`
  // );

  const subject = gmailTemplate.subject;
  let emailBody;

  if (gmailTemplate.type === "html") {
    emailBody =
      (gmailTemplate.html || "").replace(/\$\{name\}/g, Name) + trackingPixel;
  } else {
    emailBody =
      (gmailTemplate.content || "").replace(/\$\{name\}/g, Name) +
      trackingPixel;
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
    mailOptions.bcc = gmailTemplate.bcc.join(", ");
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
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  return {
    to: mailOptions.to,
    status: "Failed",
    reason: "Max retries reached.",
  };
}

async function sendEmail(
  gmailCredentials,
  gmailTemplate,
  tableData,
  batchId,
  userId
) {
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

  const emailPromises = tableData.map((data) => {
    const mailOptions = generateEmail(
      data,
      gmailCredentials,
      gmailTemplate,
      batchId
    );
    return sendIndividualEmail(transporter, mailOptions);
  });

  const emailResults = await Promise.allSettled(emailPromises);

  const successfulEmails = emailResults.filter(
    (result) =>
      result.status === "fulfilled" && result.value.status === "Success"
  ).length;

  const res = await saveBatch(batchId, userId, successfulEmails, gmailCredentials._id, gmailTemplate._id);
  // console.log(res)
  return emailResults;
}

module.exports = sendEmail;

async function saveBatch(
  batchId,
  userId,
  emailCount,
  emailCredentialId,
  emailTemplateId
) {
  const newBatch = new EmailBatch({
    _id: batchId,
    userId,
    timestamp: new Date().toISOString(),
    emailCount,
    emailCredentialId,
    emailTemplateId,
  });

  const savedBatch = await newBatch.save();
  if (!savedBatch) {
    throw new Error("Failed to save email batch");
  }

  return savedBatch;
}
