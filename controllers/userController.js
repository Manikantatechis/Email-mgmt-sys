const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("cookie-parser");

// Utility function to generate JWT tokens
const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


// Register User
const registerUser = asyncHandler(async (req, res) => {
	const loggedInUserId = req.userId; // Assuming req.userId is filled after verifying JWT
	const loggedInUser = await User.findById(loggedInUserId);

	if (loggedInUser) {
		if (loggedInUser.role === "director" || (loggedInUser.role === "manager" && req.body.role !== "director" && req.body.role !== "manager")) {
			// Allowed to register
		} else {
			res.status(403)
			throw new Error("Not authorized to add this type of user");
		}
	} else {
		res.status(403)
		throw new Error("Not authorized to add users");
	}

	const { first_name, last_name, email, password, role } = req.body;
	if (!email || !password || !first_name || !last_name ||!role) {
		res.status(400);
		throw new Error("please enter all the required fields");
	}
	if (password.length < 6) {
		res.status(400);
		throw new Error("Password must be at least 6 characters");
	}

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		res.status(400);
		throw new Error("Email already in use");
	}

	const newUser = await User.create({
		first_name,
		last_name,
		email,
		password,
		role,
	});

	//Generate Token
	const token = generateToken(newUser._id, newUser.role);

	//send HTTP-only cookie
	res.cookie("token", token, {
		path: "/",
		httpOnly: true,
		expires: new Date(Date.now() + 1000 * 86400), // 1 day
		sameSite: "none",
		secure: true,
	});

	res.status(201).json({
		first_name: newUser.first_name,
		last_name: newUser.last_name,
		email: newUser.email,
		role: newUser.role,
	});
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		res.status(400);
		throw new Error("User not found");
	}

	const isPasswordMatch = await bcrypt.compare(password, user.password);

	if (!isPasswordMatch) {
		res.status(400);
		throw new Error("Invalid credentials");
	}

	const token = generateToken(user._id, user.role);

	res.cookie("token", token, {
		path: "/",
		expires: new Date(Date.now() + 1000 * 86400), // 1 day
		sameSite: "none",
		httpOnly: true,
		secure: true,
	});

	res.status(200).json({
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		role: user.role,
	});
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
	res.cookie("token", "", {
		path: "/",
		expires: new Date(0),
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
	res.status(200).send("Logout successful");
});

// Update User Info
const updateUserInfo = asyncHandler(async (req, res) => {
	const loggedInUserId = req.userId;

	const loggedInUser = await User.findById(loggedInUserId);

	const userIdToUpdate = req.params.userId;
	const userToUpdate = await User.findById(userIdToUpdate);

	if (!userToUpdate) {
		res.status(404).send("User to update not found");
	}

	const canUpdate = loggedInUser.role === "director" || (loggedInUser.role === "manager" && ["user", "engineer"].includes(userToUpdate.role)) || loggedInUser._id.toString() === userIdToUpdate;

	if (!canUpdate) {
		res.status(403).send("Not authorized to update this user");
	}

	const { first_name, last_name, role, password } = req.body;

	if (first_name) userToUpdate.first_name = first_name;
	if (last_name) userToUpdate.last_name = last_name;
	if (role) userToUpdate.role = role;
	if (password) userToUpdate.password = password;

	await userToUpdate.save();

	res.status(200).json(userToUpdate);
});

// List Users
const listUsers = asyncHandler(async (req, res) => {
	const loggedInUserId = req.userId;
	const loggedInUser = await User.findById(loggedInUserId);

	let query = {};

	if (loggedInUser.role === "manager") {
		query.role = { $in: ["engineer", "user"] };
	} else if (loggedInUser.role !== "director") {
		query._id = loggedInUserId;
	}

	const users = await User.find(query).select("-password");
	res.status(200).json(users);
});

// Login Status
const loginStatus = asyncHandler(async (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.json(false);
	}
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		return res.json(true);
	} catch (e) {
		return res.json(false);
	}
});

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	updateUserInfo,
	listUsers,
	loginStatus,
};
