const asyncHandler = require("express-async-handler")



const emailTracking = asyncHandler(async()=>{
    console.log(req.query)
})


module.exports = {emailTracking}