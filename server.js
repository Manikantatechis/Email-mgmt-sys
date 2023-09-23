const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const gmailCredentialsRoutes = require("./routes/GmailCredentialsRoutes");
const kixieCredentialsRoutes = require("./routes/KixieCredentialsRoutes");
const gmailTemplateRoutes = require("./routes/GmailTemplateRoutes");
const kixieTemplateRoutes = require("./routes/KixieTemplateRoutes");
const sendSmsRoutes = require("./routes/sendMessageRoute");
const trackRoute = require("./routes/trackRoute");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet()); // Set secure HTTP headers

const allowedOrigins = [
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Custom middleware to allow any origin for the '/api/track' route
function allowAnyOriginForTrackRoute(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Set the appropriate origin here if needed
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}

// Apply the custom middleware to the '/api/track' route
app.use("/api/track", allowAnyOriginForTrackRoute);

// Mount Routes
app.use("/api/users", userRoutes);
app.use("/api/kixie-credentials", kixieCredentialsRoutes);
app.use("/api/gmail-credentials", gmailCredentialsRoutes);
app.use("/api/gmail-template", gmailTemplateRoutes);
app.use("/api/kixie-template", kixieTemplateRoutes);
app.use("/api/message", sendSmsRoutes);
app.use("/api/track", trackRoute); // This route now allows any origin

const PORT = process.env.PORT || 8000;

// Error middleware
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
  })
  .catch((err) => console.log(err));
