const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const gmailCredentialsRoutes = require("./routes/GmailCredentialsRoutes");
const kixieCredentialsRoutes = require("./routes/KixieCredentialsRoutes");
const htmlTemplateRoutes = require("./routes/GmailTemplateRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Routes
app.use("/api/users", userRoutes);
app.use("/api/kixie-credentials", kixieCredentialsRoutes);
app.use("/api/gmail-credentials", gmailCredentialsRoutes);
app.use("/api/html-templates", htmlTemplateRoutes);

const PORT = process.env.PORT || 8000;

//Error middleware
app.use(errorHandler);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`server running on port : ${PORT}`));
	})
	.catch((err) => console.log(err));
