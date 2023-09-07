const express = require("express");
const router = express.Router();

// Route to add an HTML template
router.post("/add", addHtmlTemplate);

// Route to list all HTML templates
router.get("/list", listHtmlTemplates);

// Route to edit an HTML template (by its ID)
router.put("/edit/:id", editHtmlTemplate);

// Route to delete an HTML template (by its ID)
router.delete("/delete/:id", deleteHtmlTemplate);

module.exports = router;
