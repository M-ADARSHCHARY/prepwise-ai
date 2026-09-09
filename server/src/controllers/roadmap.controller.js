import mongoose from "mongoose";
import { Roadmap } from "../models/index.model.js";
import { AppError } from "../middleware/AppError.js";

export const getPendingRevision = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;

    if (!mongoose.isValidObjectId(roadmapId)) {
      return next(new AppError("Invalid roadmap id", 400));
    }

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return next(new AppError("Roadmap not found", 404));
    }

    if (!roadmap.pendingRevision) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: roadmap.pendingRevision,
    });
  } catch (error) {
    next(error);
  }
};



export const applyPendingRevision = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;

    console.log(
      "Applying pending revision for roadmap:",
      roadmapId,
    );

    if (!mongoose.isValidObjectId(roadmapId)) {
      return next(
        new AppError("Invalid roadmap id", 400),
      );
    }

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return next(
        new AppError("Roadmap not found", 404),
      );
    }

    if (!roadmap.pendingRevision) {
      return next(
        new AppError("No pending revision available", 404),
      );
    }

    const revision = roadmap.pendingRevision.data;
    const fromItemIndex =
      roadmap.pendingRevision.fromItemIndex;
    console.log("fromItemIndex, roadmap.items.length", fromItemIndex, roadmap.items.length);
    if (
      typeof fromItemIndex !== "number" ||
      fromItemIndex < 0 ||
      fromItemIndex >= roadmap.items.length
    ) {
      return next(
        new AppError(
          "Invalid adaptive roadmap starting position",
          400,
        ),
      );
    }

    if (!revision?.items || !Array.isArray(revision.items)) {
      return next(
        new AppError(
          "Invalid adaptive roadmap data",
          400,
        ),
      );
    }

    /*
     * Preserve everything BEFORE the failed item.
     *
     * Example:
     *
     * Day 4 Item 1  ← preserved
     * Day 4 Item 2  ← fromItemIndex
     * Day 4 Item 3
     * Day 5 Item 1
     *
     * Everything before fromItemIndex keeps its
     * original MongoDB _id and progress.
     */
    const preservedItems = roadmap.items.slice(
      0,
      fromItemIndex,
    );

    /*
     * These are the newly generated adaptive items.
     *
     * Mongoose will generate new _ids for these items
     * because they are new roadmap subdocuments.
     */
    const newItems = revision.items.map((item) => ({
      dayNumber: item.dayNumber,
      title: item.title,
      category: item.category,
      durationHours: item.durationHours,
      description: item.description,
      topics: item.topics || [],
      hasQuiz: item.hasQuiz || false,
      quizCompleted: false,
      quizScore: null,
    }));

    /*
     * Preserve old items and replace everything
     * from the failed item onward.
     */
    roadmap.items = [
      ...preservedItems,
      ...newItems,
    ];

    roadmap.pendingRevision = null;
    roadmap.lastAdaptedAt = new Date();

    await roadmap.save();

    console.log(
      "Pending revision applied successfully for roadmap:",
      roadmapId,
    );

    return res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    console.error(
      "Error applying pending roadmap revision:",
      error,
    );

    next(error);
  }
};



export const rejectPendingRevision = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;
   
    console.log(
      "Rejecting pending revision for roadmap:",
      roadmapId,
    );

    if (!mongoose.isValidObjectId(roadmapId)) {
      return next(
        new AppError("Invalid roadmap id", 400),
      );
    }

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return next(
        new AppError("Roadmap not found", 404),
      );
    }

    if (!roadmap.pendingRevision) {
      return next(
        new AppError("No pending revision available", 404),
      );
    }

    // Remove the pending revision.
    // The actual roadmap remains completely unchanged.
    roadmap.pendingRevision = null;

    await roadmap.save();

    console.log(
      "Pending revision rejected successfully:",
      roadmapId,
    );

    return res.status(200).json({
      success: true,
      data: {
        roadmapId: roadmap._id,
        message: "Pending roadmap revision rejected",
      },
    });
  } catch (error) {
    console.error(
      "Error rejecting pending roadmap revision:",
      error,
    );

    next(error);
  }
};