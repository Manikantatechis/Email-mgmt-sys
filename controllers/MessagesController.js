const asyncHandler = require("express-async-handler");
const { sendQueue } = require("../tasks/scheduler");

// Import your models
const KixieCredentials = require("../models/kixieCredModel");
const KixieTemplate = require("../models/kixieTemplateModel");
const GmailCredentials = require("../models/gmailCredModel");
const GmailTemplate = require("../models/gmailTemplateModel");
const EmailBatch = require("../models/emailModel");
const ScheduledTask = require("../models/scheduledTaskModel");
const sendMessagesService = require("../services/sendMessageService");




const sendMessages = asyncHandler(async (req, res) => {
  const {
    userId,
    body: { actionType, actionData, tableData, scheduledTime },
  } = req;

  if (scheduledTime && new Date(scheduledTime) > new Date()) {
    const newTask = new ScheduledTask({
      userId,
      actionType,
      actionData,
      tableData,
      scheduledTime,
    });
    await newTask.save();

    sendQueue.add(
      { taskId: newTask._id }, // Pass taskId to the queue
      { delay: new Date(scheduledTime) - Date.now() }
    );

    res.status(200).json({ message: "Scheduled successfully!" });
  } else {
    const summary = await sendMessagesService(
      userId,
      actionType,
      actionData,
      tableData
    );
    res.status(200).json(summary);
  }
});





module.exports = { sendMessages };
