const cron = require("node-cron");
const User = require("../models/userModel");

const deleteOldNotifications = async () => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Subtract 1 day

  try {
    await User.updateMany(
      {},
      {
        $pull: {
          notifications: {
            timestamp: { $lt: twoDaysAgo },
          },
        },
      }
    );

    console.log("Old notifications deleted.");
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
};

module.exports = deleteOldNotifications;
