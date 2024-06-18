import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createTeacher,
  getSingleTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  updateBankdetail
} from '../controller/teacherCtrl.js';
const router = express.Router();

// Create a new teacher
router.post('/create', authMiddleware, createTeacher);

router.get('/', getAllTeachers);

// Get a single teacher by ID
router.get('/:id', getSingleTeacher);

// Update a teacher by ID
router.put('/update-back-details', authMiddleware, updateBankdetail);
router.put('/:id', authMiddleware, isAdmin, updateTeacher);

// Delete a teacher by ID
router.delete('/:id', authMiddleware, isAdmin, deleteTeacher);

export default router;
