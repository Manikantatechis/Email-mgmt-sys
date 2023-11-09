const Queue = require("bull");
const ScheduledTask = require("../models/scheduledTaskModel");
const sendMessagesService = require("../services/sendMessageService");
// const { sendMessagesService } = require('./service');

const sendQueue = new Queue("sendMessages", {
  redis: {
    host: "redis-12441.c81.us-east-1-2.ec2.cloud.redislabs.com",
    port: 12441,
    password: "T86u5478PMBrp39WgJ2chr4fGPj7sPo5",
  },
});

sendQueue.process(async (job) => {
  try {
    const taskId = job.data.taskId;
    const task = await ScheduledTask.findById(taskId);

    if (task && task.status === "pending") {
      const { userId, actionType, actionData, tableData } = task;
      console.log({ userId, actionType, actionData, tableData })
      const summary = await sendMessagesService(
        userId,
        actionType,
        actionData,
        tableData
      );
      console.log(summary);
      const taskData = await ScheduledTask.updateOne(
        { _id: taskId },
        {
          status: "completed",
          summary: summary, // Make sure this summary is structured according to the summarySchema
          tableData: [], // Set tableData to an empty array or use $unset to remove the field
        }
      );
      console.log(taskData);
    }
  } catch (error) {
    console.error("Error processing task:", error);
  }
});

sendQueue.on("error", (error) => {
  console.log(`Error: ${error.message}`);
});

module.exports = { sendQueue };
