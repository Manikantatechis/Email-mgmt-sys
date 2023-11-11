const asyncHandler = require("express-async-handler");
const ScheduledTask = require("../models/scheduledTaskModel");
const { sendQueue } = require("../tasks/scheduler");

// Get a list of all pending and completed tasks for a user with specific fields
const getAllScheduledTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await ScheduledTask.find(
      {
        userId: userId,
        status: { $in: ["pending", "completed"] },
      },
      "_id actionType scheduledTime status summary tableData "
    )
      .sort({ _id: -1 })
      .lean()
      .exec();

    // Map the tasks to include specific fields and conditionally include summary._id
    const transformedTasks = tasks.map((task) => {
      const smsSummaryLength =
        task.status === "completed" && task.summary && task.summary.smsSummary
          ? task.summary.smsSummary.length
          : 0;

      const successfulEmailsLength =
        task.status === "completed" &&
        task.summary &&
        task.summary.emailSummary &&
        task.summary.emailSummary.successfulEmails
          ? task.summary.emailSummary.successfulEmails.length
          : 0;

      const scheduledLength = task.tableData && task.tableData.length;

      return {
        _id: task._id,
        type: task.actionType,
        count:
          task.status === "completed"
            ? smsSummaryLength || successfulEmailsLength
            : scheduledLength,
        created: task._id.getTimestamp(),
        scheduled: task.scheduledTime,
        status: task.status,
      };
    });

    res.status(200).json({
      success: true,
      data: transformedTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// Get the summary of a specific completed task by _id
const getTaskSummary = asyncHandler(async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await ScheduledTask.findOne(
      {
        _id: taskId,
        status: "completed", // Ensure task is completed
      },
      "summary"
    )
      .lean()
      .exec();

    if (!task || !task.summary) {
      return res.status(404).json({
        success: false,
        message: "Summary not found",
      });
    }

    res.status(200).json({
      success: true,
      summary: task.summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

const cancelScheduledTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // First, attempt to remove the task data from the database
    const task = await ScheduledTask.findByIdAndRemove(taskId);

    if (task) {
      // If the task exists and is removed, then proceed to remove the job from the queue
      const job = await sendQueue.getJob(taskId);
      if (job) {
        await job.remove();
        console.log(`Job removed: ${job.id}`);
        // Respond to the client that the task and job were successfully canceled
        res
          .status(200)
          .send({ message: `Task and job ${job.id} canceled successfully.` });
      } else {
        // The job was not found in the queue, respond with a different message
        res
          .status(200)
          .send({
            message: `Task data removed, but job was not found in the queue.`,
          });
      }
    } else {
      // If the task is not found, respond with an error message
      res.status(404).send({ message: "Task not found in the database." });
    }
  } catch (error) {
    // Catch any errors that occur and respond accordingly
    console.error(`Error canceling task ${taskId}:`, error);
    res.status(500).send({ message: "Error canceling task." });
  }
});

module.exports = { getAllScheduledTasks, getTaskSummary, cancelScheduledTask };
