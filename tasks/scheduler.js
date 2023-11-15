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
          summary: summary, 
          tableData: [], 
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
