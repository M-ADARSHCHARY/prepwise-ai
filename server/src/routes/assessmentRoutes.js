import express from 'express';
import {  getAssessmentById, getLatestCompletedAssessment, submitAssessment } from '../controllers/assessment.controller.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { createAssessment } from '../controllers/assessment.controller.js';
const router = express.Router();


router.post("/item/:itemId/assessment",verifyJWT, createAssessment);
router.get("/item/:itemId/result",verifyJWT,getLatestCompletedAssessment);
router.get('/:assessmentId',verifyJWT, getAssessmentById);
router.post("/:assessmentId/submit",verifyJWT,submitAssessment);


export default router;