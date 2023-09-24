const EmailBatch = require("../models/emailModel");


// Controller function to fetch aggregated email data
const getEmailData = async (req, res) => {
    try {
        const slot = req.query.slot || 'month'; // default slot to 'month' if not provided

        // Base aggregation pipeline to group by year and month or week
        let groupBy = {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" }
        };

        if (slot === 'week') {
            groupBy.week = { $week: "$timestamp" };
        }

        const aggregatedData = await EmailBatch.aggregate([
            {
                $group: {
                    _id: groupBy,
                    totalEmailsSent: { $sum: "$emailCount" },
                    totalEmailsOpened: { $sum: { $size: "$openedEmail" } }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Transform the data to be compatible with the chart
        const responseData = {
            emailSent: [],
            emailOpened: []
        };

        aggregatedData.forEach(data => {
            responseData.emailSent.push(data.totalEmailsSent);
            responseData.emailOpened.push(data.totalEmailsOpened);
        });

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching email data', error: error.message });
    }
};

module.exports = {getEmailData};
