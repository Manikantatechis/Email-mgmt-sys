const KixieCredentials = require("../models/kixieCredModel");
const asyncHandler = require("express-async-handler");

// Helper function to validate Kixie Credentials
const validateKixieCredentials = ({ name, phone, kixieUserId, apiKey, businessId }) => {
  return name && phone && kixieUserId && apiKey && businessId;
};

// Helper function to find Kixie Credentials
const findKixieCredentials = async (userId, type) => {
  return await KixieCredentials.find({
    $or: [
      { userId, type: 'personal' },
      { type: 'global' }
    ]
  }).lean();
};

// Add new Kixie Credentials
exports.addKixieCredentials = asyncHandler(async (req, res) => {
  const { role, userId } = req;

  if (role !== "manager" && role !== "director") {
    throw new Error("You don't have permission to perform this action");
  }

  if (!validateKixieCredentials(req.body)) {
    throw new Error("Please enter all the necessary fields");
  }

  const newCredentials = new KixieCredentials({
    ...req.body,
    userId
  });

  await newCredentials.save();
  res.status(201).json({ message: "Successfully added" });
});

// Edit Kixie Credentials
exports.editKixieCredentials = asyncHandler(async (req, res) => {
  const { role, userId } = req;

  if (role !== "manager" && role !== "director") {
    throw new Error("You don't have permission to perform this action");
  }

  const updatedCredentials = await KixieCredentials.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!updatedCredentials) {
    throw new Error("KixieCredentials not found");
  }

  res.status(200).json({ message: "Successfully updated" });
});

// List Kixie Credentials
exports.listKixieCredentials = asyncHandler(async (req, res) => {
  const { userId } = req;
  const credentials = await findKixieCredentials(userId, 'personal');
  res.status(200).json(credentials);
});

// List Kixie Names
exports.listKixieNames = asyncHandler(async (req, res) => {
  const { userId } = req;
  const credentials = await findKixieCredentials(userId, 'personal');
  res.status(200).json(credentials.map(cred => ({ _id: cred._id, name: cred.name })));
});
