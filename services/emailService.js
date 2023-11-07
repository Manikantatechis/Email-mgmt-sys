const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { encrypt } = require("../utils/encrytpAndDecryptText");
const EmailBatch = require("../models/emailModel");

const MAX_RETRIES = 3; // Number of times to retry sending
const RETRY_DELAY = 5000; // Delay between retries in milliseconds (5 seconds)
const DELAY_BETWEEN_EMAILS = 1000; // Delay between sending individual emails (1 second)
const BACKEND_URL = process.env.BACKEND_URL; // Read once and use everywhere

// Create a single transporter object using the default SMTP transport
const createTransporter = (gmailCredentials)=>{

return  nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: gmailCredentials.email,
    clientId: gmailCredentials.oauthClientId,
    clientSecret: gmailCredentials.oauthClientSecret,
    refreshToken: gmailCredentials.oauthRefreshToken,
  },
});
}

function isValidEmail(email) {
  // Placeholder for email validation logic
  // Replace this with your actual email validation
  return email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

async function sendIndividualEmail(transporter, mailOptions, attempt = 1) {
  if (!isValidEmail(mailOptions.to)) {
    // console.log(`Invalid email: ${mailOptions.to}`);
    return {
      Name: mailOptions.name,
      Email: mailOptions.to,
      status: "Failed",
      reason: "Invalid email id",
    };
  }

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Email sent to ${mailOptions.to}`);
    return { Name: mailOptions.name, Email: mailOptions.to, status: "Success" };
  } catch (error) {
    console.error(`Attempt ${attempt} failed:`, error);
    if (attempt >= MAX_RETRIES) {
      return {
        Name: mailOptions.name,
        Email: mailOptions.to,
        status: "Failed",
        reason: "Max retries reached",
      };
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    return sendIndividualEmail(transporter, mailOptions, attempt + 1);
  }
}

async function sendEmail(gmailCredentials, gmailTemplate, tableData, batchId, userId) {
  let successfulEmailsCount = 0;
  let successfulEmails = [];
  let failedEmails = [];
  let transporter = createTransporter(gmailCredentials)

  for (const data of tableData) {
    const mailOptions = generateEmail(
      data,
      gmailCredentials,
      gmailTemplate,
      batchId
    );
    const result = await sendIndividualEmail(transporter, mailOptions);
    if (result.status === "Success") {
      successfulEmailsCount++;
      successfulEmails.push(result);
    } else {
      failedEmails.push(result);
    }
    await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
  }

  const batchResult = await saveBatch(
    batchId,
    userId,
    successfulEmailsCount,
    gmailCredentials._id,
    gmailTemplate._id
  );
  // console.log(`Emails sent successfully: ${successfulEmailsCount}`);
  // console.log(`Failed emails: ${failedEmails.length}`);

  return { successfulEmailsCount, successfulEmails, failedEmails, batchResult };
}

async function saveBatch(
  batchId,
  userId,
  emailCount,
  emailCredentialId,
  emailTemplateId
) {
  if(emailCount === 0){
    return "no emails sent"
  }
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
}


function generateEmail(
  { Name, Email },
  gmailCredentials,
  gmailTemplate,
  batchId
) {
  const trackingData = JSON.stringify({ batchId, Email, Name });
  const encryptedTrackingData = encrypt(trackingData);
  const trackingPixel = `<img src="${BACKEND_URL}/api/track?data=${encryptedTrackingData}" width="1" height="1" alt="" crossorigin="anonymous"/>`;
  const subject = gmailTemplate.subject;
  const rawEmailBody =
    gmailTemplate.type === "html" ? gmailTemplate.html : gmailTemplate.content;
  const emailBody =
    replaceDateInTemplate(rawEmailBody.replace(/\$\{name\}/g, Name)) +
    trackingPixel;

  const mailOptions = {
    from: gmailCredentials.email,
    to: Email,
    subject,
    html: emailBody, // You can set plain text as well with `text` field
    cc: gmailTemplate.cc?.join(", "),
    bcc: gmailTemplate.bcc?.join(", "),
    name: Name,
  };
  return mailOptions;
}

function replaceDateInTemplate(content) {
  const formattedDate = formatDateInUSEastern(new Date());
  return content.replace(/\$\{Month\} \$\{Date\}, \$\{year\}/g, formattedDate);
}

function formatDateInUSEastern(date) {
  const usDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const options = { year: "numeric", month: "long", day: "2-digit" };
  return new Intl.DateTimeFormat("en-US", options).format(usDate);
}

module.exports = sendEmail;
