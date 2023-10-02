const EmailBatch = require("../models/emailModel");

const getEmailData = async (req, res) => {
  try {
    // req.query.slot = "week"
    const slot = req.query.slot || "month";

    const responseData = {
      emailSent: slot === "month" ? Array(12).fill(0) : Array(7).fill(0),
      emailOpened: slot === "month" ? Array(12).fill(0) : Array(7).fill(0),
    };

    const groupBy =
      slot === "month"
        ? { year: { $year: "$timestamp" }, month: { $month: "$timestamp" } }
        : {
            year: { $year: "$timestamp" },
            week: { $isoDayOfWeek: "$timestamp" },
          };

    const sortCriteria =
      slot === "month"
        ? { "_id.year": 1, "_id.month": 1 }
        : { "_id.year": 1, "_id.week": 1 };

    const aggregatedData = await EmailBatch.aggregate([
      {
        $group: {
          _id: groupBy,
          totalEmailsSent: { $sum: "$emailCount" },
          totalEmailsOpened: { $sum: { $size: "$openedEmail" } },
        },
      },
      {
        $sort: sortCriteria,
      },
    ]);

    aggregatedData.forEach((data) => {
      const index = slot === "month" ? data._id.month - 1 : data._id.week - 1;
      responseData.emailSent[index] = data.totalEmailsSent;
      responseData.emailOpened[index] = data.totalEmailsOpened;
    });

    res.status(200).json(responseData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching email data", error: error.message });
  }
};



module.exports = {getEmailData};