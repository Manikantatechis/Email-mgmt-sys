const EmailBatch = require("../models/emailModel");
const asyncHandler = require("express-async-handler");
const kixieBatch = require("../models/kixieModel");

const getEmailData = 
asyncHandler(async (req, res) => {
  try {
    // req.query.slot = "week"
    const slot = req.query.slot || "month";
    console.log(slot)

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
});

const getSMSData = asyncHandler(

async (req, res) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let today = new Date();
    let weekData = new Array(7).fill(0);

    for (let i = 0; i < 7; i++) {
        let startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        let endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        let aggregatedData = await kixieBatch.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSMS: { $sum: "$smsCount" }
                }
            }
        ]);

        let count = aggregatedData.length ? aggregatedData[0].totalSMS : 0;

        weekData[daysOfWeek.indexOf(daysOfWeek[today.getDay()])] = count;

        // Move to previous day
        today.setDate(today.getDate() - 1);
    }

    res.json(weekData);
});





module.exports = {getEmailData, getSMSData};