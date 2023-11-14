const EmailBatch = require("../models/emailModel");
const asyncHandler = require("express-async-handler");
const kixieBatch = require("../models/kixieModel");

const getEmailData = asyncHandler(async (req, res) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let today = new Date();
  let weekData = {
    emailSent: new Array(7).fill(0),
    emailOpened: new Array(7).fill(0),
  };

  // Determine the start of the 7-day period for current week and past week
  let startOfCurrentPeriod = new Date(today);
  startOfCurrentPeriod.setDate(today.getDate() - today.getDay()); // This will give us start of this week (Sunday)
  startOfCurrentPeriod.setHours(0, 0, 0, 0);

  let startOfPastPeriod = new Date(startOfCurrentPeriod);
  startOfPastPeriod.setDate(startOfPastPeriod.getDate() - 7);

  // Aggregate data for the entire 7-day period
  let aggregatedDataCurrentWeek = await EmailBatch.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startOfCurrentPeriod,
          $lte: today,
        },
      },
    },
    {
      $group: {
        _id: {
          dayOfWeek: { $dayOfWeek: "$timestamp" },
        },
        totalEmailsSent: { $sum: "$emailCount" },
        totalEmailsOpened: { $sum: { $size: "$openedEmail" } },
      },
    },
  ]);

  let aggregatedDataPastWeek = await EmailBatch.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startOfPastPeriod,
          $lte: startOfCurrentPeriod,
        },
      },
    },
    {
      $group: {
        _id: {
          dayOfWeek: { $dayOfWeek: "$timestamp" },
        },
        totalEmailsSent: { $sum: "$emailCount" },
        totalEmailsOpened: { $sum: { $size: "$openedEmail" } },
      },
    },
  ]);

  // Map the aggregated data to the weekData array
  for (let data of aggregatedDataCurrentWeek) {
    const index = (data._id.dayOfWeek + 5) % 7; // Shift to align with our array
    weekData.emailSent[index] = data.totalEmailsSent;
    weekData.emailOpened[index] = data.totalEmailsOpened;
  }

  for (let i = today.getDay() + 1; i < 7; i++) {
    const data = aggregatedDataPastWeek.find(d => (d._id.dayOfWeek + 5) % 7 === i);
    if (data) {
      weekData.emailSent[i] = data.totalEmailsSent;
      weekData.emailOpened[i] = data.totalEmailsOpened;
    }
  }

  // Aggregate total emails sent and opened all time
  const totalAggregatedData = await EmailBatch.aggregate([
    {
      $group: {
        _id: null,
        totalEmailsSentAllTime: { $sum: "$emailCount" },
        totalEmailsOpenedAllTime: { $sum: { $size: "$openedEmail" } },
      },
    },
  ]);

  // Adding the total counts to weekData
  if (totalAggregatedData[0]) {
    weekData.totalEmailsSentAllTime = totalAggregatedData[0].totalEmailsSentAllTime;
    weekData.totalEmailsOpenedAllTime = totalAggregatedData[0].totalEmailsOpenedAllTime;
  } else {
    weekData.totalEmailsSentAllTime = 0;
    weekData.totalEmailsOpenedAllTime = 0;
  }

  res.status(200).json(weekData);
});



const getSMSData = asyncHandler(async (req, res) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let today = new Date();
  let weekData = new Array(7).fill(0);

  // Determine the start of the 7-day period
  let startOfPeriod = new Date(today);
  startOfPeriod.setDate(today.getDate() - 6);
  startOfPeriod.setHours(0, 0, 0, 0);

  // Aggregate data for the entire 7-day period
  let aggregatedData = await kixieBatch.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startOfPeriod,
          $lte: today,
        },
      },
    },
    {
      $group: {
        _id: {
          dayOfWeek: { $dayOfWeek: "$timestamp" },
        },
        totalSMS: { $sum: "$smsCount" },
      },
    },
  ]);

  // Map the aggregated data to the weekData array
  for (let data of aggregatedData) {
    const index = (data._id.dayOfWeek + 5) % 7; // MongoDB's dayOfWeek is 1-indexed starting from Sunday
    weekData[index] = data.totalSMS;
  }

  // Aggregate total SMS sent all time
  const totalAggregatedData = await kixieBatch.aggregate([
    {
      $group: {
        _id: null,
        totalSMSSentAllTime: { $sum: "$smsCount" },
      },
    },
  ]);

  res.json({
    weekData,
    totalSMSSentAllTime: totalAggregatedData[0].totalSMSSentAllTime,
  });
});

module.exports = { getEmailData, getSMSData };
