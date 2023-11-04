const Queue = require("bull");
const ScheduledTask = require("../models/scheduledTaskModel");
const { sendMessagesService } = require("../controllers/MessagesController");
// const { sendMessagesService } = require('./service');

const sendQueue = new Queue('sendMessages', {
  redis: {
    host: "redis-12441.c81.us-east-1-2.ec2.cloud.redislabs.com",
    port: 12441,
    password: 'T86u5478PMBrp39WgJ2chr4fGPj7sPo5'
    // if you have a password set for Redis, you need to include it here
    // password: "yourpassword",
  },
});

sendQueue.process(async (job) => {
  const taskId = job.data.taskId;
  const task = await ScheduledTask.findById(taskId);

  if (task && task.status === "pending") {
    const { userId, actionType, actionData, tableData } = task;
    console.log({task})
    console.log("scheduled");
    await sendMessagesService(userId, actionType, actionData, tableData);
    await ScheduledTask.updateOne({ _id: taskId }, { status: "completed" });
  }
});

sendQueue.on('error', (error) => {
  console.log(`Hey: ${error.message}`);
});


module.exports = { sendQueue };
