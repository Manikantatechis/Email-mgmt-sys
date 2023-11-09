const asyncHandler = require("express-async-handler");
const ScheduledTask = require("../models/scheduledTaskModel");

// Get a list of all pending and completed tasks for a user with specific fields
const getAllScheduledTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await ScheduledTask.find(
      {
        userId: userId,
        status: { $in: ["pending", "completed"] },
      },
      "_id actionType scheduledTime status summary._id"
    )
      .lean()
      .exec();

    // Map the tasks to include specific fields and conditionally include summary._id
    const transformedTasks = tasks.map((task) => ({
      _id: task._id,
      Type: task.actionType,
      Count:
        task.status === "completed" && task.summary
          ? task.summary.smsSummary.length +
            task.summary.emailSummary.successfulEmails.length
          : null, // Only calculate count if completed
      Created: task._id.getTimestamp(),
      Scheduled: task.scheduledTime,
      Status: task.status,
      SummaryId: task.status === "completed" ? task.summary?._id : undefined, // Only include summary._id for completed tasks
    }));

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

module.exports = { getAllScheduledTasks, getTaskSummary };
