const cron = require("node-cron");
const User = require("../models/userModel");

const deleteOldNotifications = async () => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Subtract 1 day

  try {
    const result = await User.updateMany(
      {},
      {
        $pull: {
          notifications: {
            time: { $lt: twoDaysAgo },
          },
        },
      }
    );
  
    console.log("Deletion result:", result);
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
  
};

module.exports = deleteOldNotifications;
