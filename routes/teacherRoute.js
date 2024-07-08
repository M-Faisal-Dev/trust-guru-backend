import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createTeacher,
  getSingleTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  updateBankdetail,
  getSingleTeacherByToken,
  updateSkillsAndBiography,
  createUpdatePoints,
  SingleTeacher,
  getAllTeacherwithPoints
} from '../controller/teacherCtrl.js';
const router = express.Router();

// Create a new teacher
router.get('/', getAllTeacherwithPoints);
router.get('/get-all', getAllTeachers);
router.post('/create', authMiddleware, createTeacher);
router.get('/get-single-teacher', authMiddleware, getSingleTeacherByToken);

router.get('/:id', SingleTeacher);


// Get a single teacher by ID

// Update a teacher by ID
router.put('/update-back-details', authMiddleware, updateBankdetail);
router.put('/update-skills', authMiddleware, updateSkillsAndBiography);
router.put('/update-point', authMiddleware, createUpdatePoints);
router.put('/:id', authMiddleware, isAdmin, updateTeacher);

// Delete a teacher by ID
router.delete('/:id', authMiddleware, isAdmin, deleteTeacher);

export default router;
