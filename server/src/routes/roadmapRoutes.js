import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { applyPendingRevision, getPendingRevision, rejectPendingRevision } from "../controllers/roadmap.controller.js";

const router = express.Router();

router.get("/:roadmapId/pending-revision", verifyJWT, getPendingRevision);
router.patch("/:roadmapId/apply-revision", verifyJWT, applyPendingRevision);
router.delete("/:roadmapId/reject-revision",verifyJWT,rejectPendingRevision);
export default router;
