const mongoose = require("mongoose");
const { Schema } = mongoose;

const smsSummaryEntrySchema = new Schema({
  status: {
    // This corresponds to the "fulfilled" status in your data
    type: String,
    required: true,
  },
  value: {
    type: new Schema(
      {
        Name: {
          type: String,
          required: true,
        },
        Phone: {
          type: String,
          required: true,
        },
        status: {
          // This is the SMS delivery status ("Failed" in your data)
          type: String,
          required: true,
        },
        reason: {
          type: String,
          required: false, // Reason may not be required for successful SMS
        },
      },
      { _id: false }
    ),
    required: true,
  },
});

const emailSummaryEntrySchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const summarySchema = new Schema({
  smsSummary: [smsSummaryEntrySchema],
  emailSummary: {
    successfulEmailsCount: {
      type: Number,
      required: true,
    },
    successfulEmails: [emailSummaryEntrySchema],
    failedEmails: [emailSummaryEntrySchema], // If you have data for failed emails
  },
});

const actionDataSchema = new Schema(
  {
    kixieCredId: {
      type: String,
      required: function () {
        return this.actionType === "sms" || this.actionType === "both";
      },
    },
    kixieTemplateId: {
      type: String,
      required: function () {
        return this.actionType === "sms" || this.actionType === "both";
      },
    },
    emailCredId: {
      type: String,
      required: function () {
        return this.actionType === "email" || this.actionType === "both";
      },
    },
    emailTemplateId: {
      type: String,
      required: function () {
        return this.actionType === "email" || this.actionType === "both";
      },
    },
  },
  { _id: false, required: false }
);

const tableDataEntrySchema = new Schema(
  {
    Name: {
      type: String,
      required: false,
    },
    Phone: {
      type: String,
      required: function () {
        return this.actionType === "sms" || this.actionType === "both";
      },
    },
    Email: {
      type: String,
      required: function () {
        return this.actionType === "email" || this.actionType === "both";
      },
      lowercase: true,
    },
  },
  { _id: false, required: false }
);

const scheduledTaskSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    index: true, // Assuming you will often query by userId
  },
  actionType: {
    type: String,
    enum: ["both", "sms", "email"],
    required: true,
  },
  actionData: {
    type: actionDataSchema,
    required: true,
  },
  tableData: {
    type: [tableDataEntrySchema],
    required: true,
    validate: {
      validator: function (v) {
        // Ensure the array length does not exceed 100
        return v.length <= 1000;
      },
      message: (props) => `${props.path} exceeds the limit of 100 entries`,
    },
  },
  scheduledTime: {
    type: Date,
    required: true,
    index: true, // Index this if you query by time
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  summary: {
    type: summarySchema,
    required: false, // Only include the summary after the task is completed
  },
});

const ScheduledTask = mongoose.model("ScheduledTask", scheduledTaskSchema);

module.exports = ScheduledTask;
