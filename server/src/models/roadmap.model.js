import mongoose from "mongoose";

const roadmapItemSchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "resume_revision",
        "project_revision",
        "coding_practice",
        "cs_fundamentals",
        "missing_skill",
      ],
      required: true,
    },

    durationHours: {
      type: Number,
      required: true,
      min: 0.5,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    topics: {
      type: [String],
      default: [],
    },

    hasQuiz: {
      type: Boolean,
      default: false,
    },

    quizCompleted: {
      type: Boolean,
      default: false,
    },

    quizScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  // { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreparationSession",
      required: true,
      unique: true,
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    focusAreas: {
      type: [String],
      default: [],
    },

    items: {
      type: [roadmapItemSchema],
      default: [],
    },

    pendingRevision: {
      type: {
        generatedFromAssessmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assessment",
          default: null,
        },
        triggerScore: {
          type: Number,
          default: null,
        },
        fromItemIndex: {
          type: Number,
          required: true,
        },

        fromItemId: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        reason: {
          type: String,
          default: "",
        },
        generatedAt: {
          type: Date,
          default: null,
        },
        data: {
          totalDays: {
            type: Number,
            required: true,
          },
          focusAreas: {
            type: [String],
            default: [],
          },
          items: {
            type: [roadmapItemSchema],
            default: [],
          },
        },
      },
      default: null,
    },

    lastAdaptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Roadmap", roadmapSchema);
