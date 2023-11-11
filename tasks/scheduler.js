const Queue = require("bull");
const ScheduledTask = require("../models/scheduledTaskModel");
const sendMessagesService = require("../services/sendMessageService");
// const { sendMessagesService } = require('./service');

const sendQueue = new Queue("sendMessages", process.env.REDIS_URL);

sendQueue.process(async (job) => {
  try {
    const taskId = job.data.taskId;
    const task = await ScheduledTask.findById(taskId);

    if (task && task.status === "pending") {
      const { userId, actionType, actionData, tableData } = task;
      const scheduled = true

      const summary = await sendMessagesService(
        userId,
        actionType,
        actionData,
        tableData,
        scheduled
      );
      console.log(summary);
      await ScheduledTask.updateOne(
        { _id: taskId },
        {
          status: "completed",
          summary: summary, // Make sure this summary is structured according to the summarySchema
          tableData: [], // Set tableData to an empty array or use $unset to remove the field
        }
      );

    }
  } catch (error) {
    console.error("Error processing task:", error);
  }
});

sendQueue.on("error", (error) => {
  console.log(`Error: ${error.message}`);
});

module.exports = { sendQueue };
