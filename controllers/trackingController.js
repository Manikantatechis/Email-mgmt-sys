const asyncHandler = require("express-async-handler");
const { decrypt } = require("../utils/encrytpAndDecryptText");
const EmailBatch = require("../models/emailModel");
const { sendNotification } = require("../socketio");



const emailTracking = asyncHandler(async (req, res) => {
    const encryptedData = req.query.data;
    if (!encryptedData || !encryptedData.includes(":")) {
        console.error("Invalid encrypted data format");
    }

    if (encryptedData) {
        try {
            const decryptedData = decrypt(encryptedData);
            const trackingInfo = JSON.parse(decryptedData);
    
            const emailBatch = await EmailBatch.findById({
                _id: trackingInfo.batchId, 
            });
            console.log({decryptedData})
    
            // Check if an email entry already exists
            const existingEmail = emailBatch.openedEmail.find(email => email.address === trackingInfo.Email.toLowerCase());
    
            if (existingEmail) {
                // If the email entry exists, push the new timestamp
                const res = await EmailBatch.updateOne(
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
                console.log(res)
                sendNotification(emailBatch.userId, {message: "opened again", email: trackingInfo.Email, time: new Date()});
            } else {
                // If the email entry doesn't exist, add a new entry
                const res = await EmailBatch.updateOne(
                    { _id: trackingInfo.batchId },
                    {
                        $push: {
                            openedEmail: {
                                address: trackingInfo.Email.toLowerCase(),
                                openedTimestamps: [new Date()]
                            }
                        }
                    },
                );
                console.log({res})
                sendNotification(emailBatch.userId, {message: "opened email", email: trackingInfo.Email, time: new Date()});
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
