import express from 'express'
import { verifyJWT } from '../middleware/verifyJWT.js';
import { generateCodingProblems } from '../controllers/codingproblem.controller.js';

const router = express.Router()


router.post(
  "/:sessionId/generate",
  verifyJWT,
  generateCodingProblems,
);

export default router