const asyncHandler = require("express-async-handler");
const { decrypt } = require("../utils/encrytpAndDecryptText");
const EmailBatch = require("../models/emailModel");

const emailTracking = asyncHandler(async (req, res) => {
    const encryptedData = req.query.data;
    if (!encryptedData || !encryptedData.includes(":")) {
        console.error("Invalid encrypted data format");
    }

    if (encryptedData) {
        try {
            const decryptedData = decrypt(encryptedData);
            const trackingInfo = JSON.parse(decryptedData);

            console.log(`Email opened with tracking Info: ${JSON.stringify(trackingInfo)} at ${new Date().toISOString()}`);

            // Try to find the email in the openedEmail array
            const emailBatch = await EmailBatch.findOne({
                _id: trackingInfo.batchId, 
                "openedEmail.address": trackingInfo.Email.toLowerCase()
            });

            if (emailBatch) {
                // If the email exists, push the new timestamp
                await EmailBatch.updateOne(
                    {
                        _id: trackingInfo.batchId,
                        "openedEmail.address": trackingInfo.Email.toLowerCase()
                    },
                    {
                        $push: {
                            "openedEmail.$.openedTimestamps": new Date()
                        }
                    }
                );
            } else {
                // If the email doesn't exist, add a new entry
                await EmailBatch.updateOne(
                    { _id: trackingInfo.batchId },
                    {
                        $push: {
                            openedEmail: {
                                address: trackingInfo.Email.toLowerCase(),
                                openedTimestamps: [new Date()]
                            }
                        }
                    }
                );
            }

        } catch (err) {
            console.error("Error decrypting or processing the data:", err);
        }
    }

    // Return a 1x1 pixel image to the client.
    const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
    res.writeHead(200, {
        "Content-Type": "image/gif",
        "Content-Length": pixel.length,
    });
    res.end(pixel);
});


module.exports = { emailTracking };
