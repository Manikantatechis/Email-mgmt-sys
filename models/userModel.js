const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: [true, "Please enter your first name"],
	},
	last_name: {
		type: String,
		required: [true, "Please enter your last name"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Please enter your email"],
		trim: true,
		match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please enter your password"],
		minLength: [6, "Password should not be less than 6 characters"],
	},
	role: {
		type: String,
		enum: ["director", "manager", "user", "engineer"],
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(this.password, salt);
	this.password = hashedPassword;
	next();
});

const User = mongoose.model("User", userSchema); // Define the model with the name 'User'

module.exports = User;
