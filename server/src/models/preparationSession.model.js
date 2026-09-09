import mongoose from "mongoose";

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const resumeImprovementSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      trim: true,
      default: "",
    },
    suggestion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const preparationSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    roleName: {
      type: String,
      required: true,
      trim: true,
    },
    timeAvailableDays: {
      type: Number,
      required: true,
      min: 1,
    },
    resumeFileName: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescriptionFileName: {
      type: String,
      required: true,
      trim: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    jobDescriptionText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [skillGapSchema],
      default: [],
    },
    resumeImprovements: {
      type: [resumeImprovementSchema],
      default: [],
    },
    aiSummary: {
      type: String,
      default: "",
      trim: true,
    },
    analysisStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    codingProblemRecommendations: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },

          platform: {
            type: String,
            enum: ["LeetCode", "GeeksForGeeks"],
            required: true,
          },

          problemNumber: {
            type: Number,
            default: null,
          },

          pattern: {
            type: String,
            required: true,
          },

          difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("PreparationSession", preparationSessionSchema);
