const express = require("express")
const {getAllScheduledTasks} = require("../controllers/ScheduledTaskController")
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router()


router.get("/list",authMiddleware, getAllScheduledTasks)

module.exports = router