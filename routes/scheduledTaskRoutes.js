const express = require("express")
const {getAllScheduledTasks, getTaskSummary} = require("../controllers/ScheduledTaskController")
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router()


router.get("/list",authMiddleware, getAllScheduledTasks)

router.get("/report/:taskId", authMiddleware, getTaskSummary)

module.exports = router