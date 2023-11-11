const crypto = require("crypto");
const KixieCredentials = require("../models/kixieCredModel");
const GmailCredentials = require("../models/gmailCredModel");
const GmailTemplate = require("../models/gmailTemplateModel");
const decryptData = require("../utils/decryptData"); // utility functions to validate action data and
const sendEmail = require("./emailService");
const KixieTemplate = require("../models/kixieTemplateModel");
const sendSms = require("./smsService");

async function sendMessagesService(userId, actionType, actionData, tableData, scheduled=false) {
  // Validate actionData based on actionType
  validateActionData(actionType, actionData);

  let smsSummary = [],
    emailSummary = [];

  const batchId = generateBatchId(userId);

  if (actionType === "sms" || actionType === "both") {
    const kixieCredentials = await getDecryptedCredentials(
      KixieCredentials,
      actionData.kixieCredId
    );
    if (kixieCredentials.apiKey) {
      kixieCredentials.apiKey = await decryptData(kixieCredentials.apiKey);
    }
    const kixieTemplate = await getTemplate(
      KixieTemplate,
      actionData.kixieTemplateId
    );
    smsSummary = await sendSms(
      kixieCredentials,
      kixieTemplate,
      tableData,
      batchId,
      userId
    );
  }

  if (actionType === "email" || actionType === "both") {
    const gmailCredentials = await getDecryptedCredentials(
      GmailCredentials,
      actionData.emailCredId
    );
    if (
      gmailCredentials.oauthClientSecret &&
      gmailCredentials.oauthRefreshToken
    ) {
      gmailCredentials.oauthClientSecret = await decryptData(
        gmailCredentials.oauthClientSecret
      );
      gmailCredentials.oauthRefreshToken = await decryptData(
        gmailCredentials.oauthRefreshToken
      );
    }
    const gmailTemplate = await getTemplate(
      GmailTemplate,
      actionData.emailTemplateId
    );

    emailSummary = await sendEmail(
      gmailCredentials,
      gmailTemplate,
      tableData,
      batchId,
      userId,
      scheduled
    );
  }

  const summary = { smsSummary, emailSummary };
  return summary;
}

// Function to generate batch id
function generateBatchId(userId) {
  const batchTime = new Date().toISOString();
  return crypto
    .createHash("sha256")
    .update(`${userId}-${batchTime}`)
    .digest("hex");
}

// Function to get decrypted credentials
async function getDecryptedCredentials(Model, id) {
  const credentials = await Model.findById(id);
  if (!credentials) {
    throw new Error(`${Model.modelName} Credentials not found`);
  }
  return credentials; // Assume decryptData function will decrypt the necessary fields
}

// Function to get a template
async function getTemplate(Model, id) {
  const template = await Model.findById(id);
  if (!template) {
    throw new Error(`${Model.modelName} Template not found`);
  }
  return template;
}

function validateActionData(actionType, actionData) {
  const { emailCredId, emailTemplateId, kixieCredId, kixieTemplateId } =
    actionData;
  if (actionType === "email" && (!emailCredId || !emailTemplateId)) {
    throw new Error("Missing required email actionData fields");
  } else if (actionType === "sms" && (!kixieCredId || !kixieTemplateId)) {
    throw new Error("Missing required SMS actionData fields");
  } else if (
    actionType === "both" &&
    (!emailCredId || !emailTemplateId || !kixieCredId || !kixieTemplateId)
  ) {
    throw new Error(
      "Missing required actionData fields for both email and SMS"
    );
  } else if (!["email", "sms", "both"].includes(actionType)) {
    throw new Error("Invalid actionType provided");
  }
}

module.exports = sendMessagesService;
