const express = require("express")
const {getAllScheduledTasks, getTaskSummary, cancelScheduledTask} = require("../controllers/ScheduledTaskController")
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router()


router.get("/list",authMiddleware, getAllScheduledTasks)

router.get("/report/:taskId", authMiddleware, getTaskSummary)

router.delete("/delete/:taskId", authMiddleware, cancelScheduledTask)


module.exports = router