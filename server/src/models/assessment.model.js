import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },

  topic: {
    type: String,
    required: true,
    trim: true,
  },

  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length === 4,
      message: "Each question must have exactly 4 options.",
    },
  },

  correctAnswer: {
    type: String,
    required: true,
    trim: true,
  },

  userAnswer: {
    type: String,
    default: null,
  },

  explanation: {
    type: String,
    default: "",
  },
});

const assessmentSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreparationSession",
      required: true,
    },

    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },

    roadmapItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
    },

    questions: {
      type: [questionSchema],
      required: true,
      default: [],
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    weakAreas: {
      type: [
        {
          topic: {
            type: String,
            required: true,
            trim: true,
          },

          correct: {
            type: Number,
            required: true,
            min: 0,
          },

          total: {
            type: Number,
            required: true,
            min: 1,
          },

          accuracy: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Assessment", assessmentSchema);
