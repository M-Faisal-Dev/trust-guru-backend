import Teacher from "../models/teacherUserModel.js"; // Adjust the import based on your file structure
import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import User from "../models/userModel.js";

// Create teacher
const createTeacher = asyncHandler(async (req, res) => {
  const {id} = req.user;
  console.log(id, "this is user id")
  validateMongoId(id);
  try {
    const createdTeacher = await Teacher.create(req.body);
    const updatedUser = await User.findByIdAndUpdate(id, { teacherId: createdTeacher._id }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(201).json(createdTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single teacher by ID
const getSingleTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all teachers
const getAllTeachers = asyncHandler(async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update teacher by ID
const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const updateBankdetail = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(id, "Bank detail updated")
  validateMongoId(id);
  const { bankName, iban, accNumber } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        'bankDetails.bankName': bankName,
        'bankDetails.iban': iban,
        'bankDetails.accNumber': accNumber 
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete teacher by ID
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(deletedTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export {
  createTeacher,
  getSingleTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  updateBankdetail
};
