// models/EmailBatchModel.js
const mongoose = require("mongoose");

const emailBatchSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	timestamp: {
		type: String,
		required: true,
	},
	emailCount: {
		type: Number,
		required: true,
	},
});

const EmailBatch = mongoose.model("EmailBatch", emailBatchSchema);

module.exports = EmailBatch;
