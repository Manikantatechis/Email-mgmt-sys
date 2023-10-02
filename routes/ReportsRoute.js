const express = require("express")
const isAuthenticated = require("../middlewares/authMiddleware")
const { getEmailData } = require("../controllers/reportsController")

const router = express.Router()


router.get("/email", isAuthenticated, getEmailData)



module.exports = router