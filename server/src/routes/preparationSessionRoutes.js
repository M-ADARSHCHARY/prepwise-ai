import express from 'express';
import { createPreparationSession, getUserPreparationSessions, getRoadmapBySessionId, getPreparationSessionById, analyzePreparationSession, generateSessionRoadmap, acceptRoadmapRevision, rejectRoadmapRevision, updateRoadmapItemCompletion, deletePreparationSessionById } from '../controllers/preparationSessionController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { verifyJWT } from '../middleware/verifyJWT.js';


const router = express.Router();

router.post(
	'/',
	upload.fields([
		{ name: 'resume', maxCount: 1 },
		{ name: 'jobDescription', maxCount: 1 },
	]),
	createPreparationSession
);
router.get('/user-sessions', verifyJWT, getUserPreparationSessions);
router.get('/:id', verifyJWT, getPreparationSessionById);
router.get('/:id/roadmap', verifyJWT, getRoadmapBySessionId);
router.post('/:id/analyze', verifyJWT, analyzePreparationSession);
router.post('/:id/generate-roadmap', verifyJWT, generateSessionRoadmap);
router.patch('/roadmap/item/:itemId', verifyJWT, updateRoadmapItemCompletion);


router.post('/:id/roadmap/revision/accept', verifyJWT, acceptRoadmapRevision);
router.post('/:id/roadmap/revision/reject', verifyJWT, rejectRoadmapRevision);

router.delete('/:sessionId', verifyJWT, deletePreparationSessionById);

export default router;