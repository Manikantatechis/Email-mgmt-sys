const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GmailTemplateSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User", // Assume you have a User model
			required: [true, "User ID is required"],
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
			required: [true, "Status is required"],
		},
		type: {
			type: String,
			enum: ["text", "html"],
			required: [true, "Type is required"],
		},
		content: {
			type: String,
		},
		html: {
			type: String,
		},
	},
	{
		timestamps: true, // Automatically includes createdAt and updatedAt fields
		validate: {
			validator: function () {
				return !!(this.content || this.html);
			},
			message: "Either content or html must be provided",
		},
	}
);

const GmailTemplate = mongoose.model("GmailTemplate", GmailTemplateSchema);

module.exports = GmailTemplate;
