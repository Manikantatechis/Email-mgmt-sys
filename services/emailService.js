const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { encrypt } = require("../utils/encrytpAndDecryptText");
const EmailBatch = require("../models/emailModel");
const { performance } = require("perf_hooks");

const MAX_RETRIES = 3; // Number of times to retry sending
const RETRY_DELAY = 500; // Delay between retries in milliseconds (5 seconds)
const BACKEND_URL = process.env.BACKEND_URL; // Read once and use everywhere
let CONCURRENCY_LIMIT = 20; // Number of emails to send at the same time

// Create a single transporter object using the default SMTP transport
const createTransporter = (gmailCredentials) => {
  const startTime = performance.now();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: gmailCredentials.email,
      clientId: gmailCredentials.oauthClientId,
      clientSecret: gmailCredentials.oauthClientSecret,
      refreshToken: gmailCredentials.oauthRefreshToken,
    },
  });
  const endTime = performance.now();
  console.log(
    `Time taken to create transporter: ${(
      (endTime - startTime) /
      60000
    ).toFixed(2)} minutes`
  );
  return transporter;
};
const startTime = performance.now();

function isValidEmail(email) {
  // Placeholder for email validation logic
  // Replace this with your actual email validation
  return email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

async function sendIndividualEmail(transporter, mailOptions, attempt = 1) {
  const sendEmailStartTime = performance.now();
  if (!isValidEmail(mailOptions.to)) {
    // console.log(`Invalid email: ${mailOptions.to}`);
    const endTime = performance.now();
    console.log(
      `Validation failed, time taken: ${(
        (endTime - sendEmailStartTime) /
        60000
      ).toFixed(2)} minutes`
    );
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
    const endTime = performance.now();
    console.log(
      `Email sent, time taken: ${(
        (endTime - sendEmailStartTime) /
        60000
      ).toFixed(2)} minutes`
    );
    return { Name: mailOptions.name, Email: mailOptions.to, status: "Success" };
  } catch (error) {
    console.error(`Attempt ${attempt} failed:`, error);
    if (attempt >= MAX_RETRIES) {
      const endTime = performance.now();
      console.log(`Email sending failed after ${attempt} attempts, time taken: ${((endTime - sendEmailStartTime) / 60000).toFixed(2)} minutes`);
      return {
        Name: mailOptions.name,
        Email: mailOptions.to,
        status: "Failed",
        reason: "Max retries reached",
      };
    } else {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return sendIndividualEmail(transporter, mailOptions, attempt + 1);
    }
  }
}

  async function sendEmailInParallel(transporter, mailOptionsList) {
    const sendEmailPromises = mailOptionsList.map((mailOptions) =>
      sendIndividualEmail(transporter, mailOptions).catch((error) => ({
        Name: mailOptions.name,
        Email: mailOptions.to,
        status: "Failed",
        reason: error.message || "Unknown error",
      }))
    );

    const results = await Promise.allSettled(sendEmailPromises);
    return results.map((result) =>
      result.status === "fulfilled" ? result.value : result.reason
    );
  }

  async function sendEmail(
    gmailCredentials,
    gmailTemplate,
    tableData,
    batchId,
    userId, scheduled
  ) {
    let successfulEmails = [];
    let failedEmails = [];

    const transporter = createTransporter(gmailCredentials);
    const allMailOptions = tableData.map((data) => {
      const emailGenStartTime = performance.now();
      const mailOptions = generateEmail(
        data,
        gmailCredentials,
        gmailTemplate,
        batchId
      );
      const emailGenEndTime = performance.now();
      console.log(
        `Time taken to generate email options: ${(
          (emailGenEndTime - emailGenStartTime) /
          60000
        ).toFixed(2)} minutes`
      );
      return mailOptions;
    });
    if(scheduled){
      CONCURRENCY_LIMIT = 5
    }else{
      CONCURRENCY_LIMIT = 15
    }
    console.log(scheduled, "limit :",CONCURRENCY_LIMIT)
    const sendEmailsStartTime = performance.now();
    // Chunk the allMailOptions array to respect the CONCURRENCY_LIMIT
    for (let i = 0; i < allMailOptions.length; i += CONCURRENCY_LIMIT) {
      const chunk = allMailOptions.slice(i, i + CONCURRENCY_LIMIT);
      const results = await sendEmailInParallel(transporter, chunk);
      successfulEmails = successfulEmails.concat(
        results.filter((r) => r.status === "Success")
      );
      failedEmails = failedEmails.concat(
        results.filter((r) => r.status === "Failed")
      );
    }
    const sendEmailsEndTime = performance.now();
    console.log(
      `Time taken to send all emails: ${(
        (sendEmailsEndTime - sendEmailsStartTime) /
        60000
      ).toFixed(2)} minutes`
    );

    const batchSaveStartTime = performance.now();
    const batchResult = await saveBatch(
      batchId,
      userId,
      successfulEmails.length,
      gmailCredentials._id,
      gmailTemplate._id
    );

    const batchSaveEndTime = performance.now();
    console.log(
      `Time taken to save batch: ${(
        (batchSaveEndTime - batchSaveStartTime) /
        60000
      ).toFixed(2)} minutes`
    );

    return { successfulEmails, failedEmails, batchResult };
  }

  async function saveBatch(
    batchId,
    userId,
    emailCount,
    emailCredentialId,
    emailTemplateId
  ) {
    if (emailCount === 0) {
      return "no emails sent";
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
