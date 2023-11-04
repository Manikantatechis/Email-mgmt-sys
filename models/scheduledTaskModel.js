const mongoose = require('mongoose');

const scheduledTaskSchema = new mongoose.Schema({
  userId: String,
  actionType: String,
  actionData: Object,
  tableData: Object,
  scheduledTime: Date,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
});

const ScheduledTask = mongoose.model('ScheduledTask', scheduledTaskSchema);
module.exports = ScheduledTask;
