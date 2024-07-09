import Teacher from "../models/teacherUserModel.js"; // Adjust the import based on your file structure
import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import User from "../models/userModel.js";
import CourseListing from "../models/courseListing.js";


// Create teacher
// const createTeacher = asyncHandler(async (req, res) => {
//   const {id} = req.user;
//   console.log(id, "this is user id")
//   validateMongoId(id);
//   try {
//     const createdTeacher = await Teacher.create(req.body);
//     const updatedUser = await User.findByIdAndUpdate(id, { teacherId: createdTeacher._id }, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(201).json(createdTeacher);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

const createTeacher = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(id, "this is user id");
  validateMongoId(id);

  try {
    let updatedUser;

    // Find user and check if teacherId exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if teacher profile already exists for the provided teacherId
    const existingTeacher = await Teacher.findById(user.teacherId);

    if (existingTeacher) {
      // Update existing teacher profile
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        user.teacherId,
        req.body,
        { new: true }
      );
      updatedUser = await User.findByIdAndUpdate(
        id,
        { teacherId: updatedTeacher._id },
        { new: true }
      );
    } else {
      // Create new teacher profile
      const createdTeacher = await Teacher.create({
        ...req.body,
        createdBy: id  // Ensure createdBy field is set to user id
      });
      updatedUser = await User.findByIdAndUpdate(
        id,
        { teacherId: createdTeacher._id },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(201).json(updatedUser);
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

const getSingleTeacherByToken = asyncHandler(async (req, res) => {
 const {id} = req.user;
  validateMongoId(id);
  try {
    const getUser = await User.findById(id);
    console.log(getUser, "get user")
    if (!getUser) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    const getTeacher = await Teacher.findById(getUser.teacherId);
    res.json(getTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const SingleTeacher = asyncHandler(async (req, res) => {
  const {id} = req.params;
  console.log(id)
   validateMongoId(id);
   try {
     const getTeacher = await Teacher.findById(id);
     res.json(getTeacher);
   } catch (err) {
     res.status(400).json({ error: err.message });
   }
 });

const createUpdatePoints = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { skills, passion, commitment, results } = req.body; // Assuming these are provided in the request body

  console.log(id);
  validateMongoId(id);

  try {
    // Find the user and validate
    const getCourse = await CourseListing.findById(id);
    if (!getCourse) {
      return res.status(404).json({ error: "User not found" });
    }
    let getUser = await User.findById(getCourse.userId[0])
    
    // Find the teacher associated with the user
    let getTeacher = await Teacher.findById(getUser.teacherId);

    // Calculate the new points
    const newTotalPoints = skills + passion + commitment + results;

    // Update or create points accordingly
    if (getTeacher.totalPoints != null) {
      // Update existing points
      getTeacher.totalPoints += newTotalPoints;
      getTeacher.lastMonth = 147; // Example value, replace with actual logic if needed
      getTeacher.averageScore = (getTeacher.totalPoints / 4).toFixed(1); // Example calculation, replace with actual logic if needed
      getTeacher.numClients = 21; // Example value, replace with actual logic if needed
    } else {
      // Create new points
      getTeacher.totalPoints = newTotalPoints;
      getTeacher.lastMonth = 147; // Example value, replace with actual logic if needed
      getTeacher.averageScore = (newTotalPoints / 4).toFixed(1); // Example calculation, replace with actual logic if needed
      getTeacher.numClients = 21; // Example value, replace with actual logic if needed
    }

    // Save the updated or new teacher document
    await getTeacher.save();

    // Send the response
    res.json({
      totalPoints: getTeacher.totalPoints,
      lastMonth: getTeacher.lastMonth,
      averageScore: getTeacher.averageScore,
      numClients: getTeacher.numClients
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all teachers
const getAllTeacherwithPoints = asyncHandler(async (req, res) => {
  const minTrustPoints = 1; // Define the minimum trust points threshold
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Number of results per page, default to 10

  try {
    // Query to find teachers with totalPoints >= minTrustPoints, sorted by totalPoints descending
    const teachers = await Teacher.find({ totalPoints: { $gte: minTrustPoints } })
      .sort({ totalPoints: -1 }) // Sort by totalPoints descending (high to low)
      .skip((page - 1) * limit) // Skip records based on pagination
      .limit(limit); // Limit number of records per page

    res.json(teachers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


const getAllTeachers = asyncHandler(async (req, res) => {
  const minTrustPoints = 0; // Define the minimum trust points threshold
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Number of results per page, default to 10

  try {
    // Query to find teachers with totalPoints >= minTrustPoints, sorted by totalPoints descending
    const teachers = await Teacher.find({ totalPoints: { $gte: minTrustPoints } })
      .sort({ totalPoints: -1 }) // Sort by totalPoints descending (high to low)
      .skip((page - 1) * limit) // Skip records based on pagination
      .limit(limit); // Limit number of records per page

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

const updateSkillsAndBiography = asyncHandler(async (req, res) => {
  const { id } = req.user;

  validateMongoId(id);

  try {
    const getUser = await User.findById(id);

    if (!getUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateFields = {};
    if (req.body.skills) updateFields.skills = req.body.skills;
    if (req.body.biography) updateFields.biography = req.body.biography;

    const updatedUser = await Teacher.findByIdAndUpdate(
      getUser.teacherId,
      updateFields,
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
  updateBankdetail,
  getSingleTeacherByToken,
  updateSkillsAndBiography,
  createUpdatePoints,
  getAllTeacherwithPoints,
  SingleTeacher
};
