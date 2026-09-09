import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAssessmentThunk,
  submitAssessmentThunk,
} from "../redux/assessment/assessmentThunk";
import { useState } from "react";

const Assessment = () => {
  const { assessmentId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const dispatch = useDispatch();

  const { assessment, assessmentResult, loading, error } = useSelector(
    (state) => state.assessment,
  );
  const question = assessment?.questions[currentQuestion];

  useEffect(() => {
    dispatch(getAssessmentThunk(assessmentId));
  }, [dispatch, assessmentId]);

  const handleSubmitTest = async () => {
    try {
      const formattedAnswers = assessment.questions.map((question, index) => ({
        questionId: question._id,
        userAnswer: answers[index],
      }));

      const result = await dispatch(
        submitAssessmentThunk({
          assessmentId,
          answers: formattedAnswers,
        }),
      ).unwrap();

      console.log("Submit response:", result);
    } catch (error) {
      console.error("Failed to submit assessment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        Loading Assessment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-red-400">
        {error.message || "Failed to load assessment."}
      </div>
    );
  }

  if (assessmentResult) {
    return (
      <div className="min-h-screen bg-[#09090b] p-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-[#111114] p-8 text-center">
          <h1 className="text-3xl font-bold">Assessment Complete</h1>

          <p className="mt-6 text-5xl font-bold">{assessmentResult.score}%</p>

          <p className="mt-4 text-zinc-400">
            {assessmentResult.correctAnswers} /{" "}
            {assessmentResult.totalQuestions} correct
          </p>

          <p className="mt-4 text-green-400">Test submitted successfully</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        Assessment not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] p-10 text-white">
      <h1 className="text-3xl font-bold">{assessment.title}</h1>

      <p className="mt-2 text-zinc-400">
        {assessment.totalQuestions} Questions
      </p>

      <div className="mt-10 rounded-2xl border border-zinc-800 bg-[#111114] p-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            Question {currentQuestion + 1} of {assessment.totalQuestions}
          </span>

          <span className="text-sm text-zinc-400">
            {Math.round(
              ((currentQuestion + 1) / assessment.totalQuestions) * 100,
            )}
            %
          </span>
        </div>

        <h2 className="mt-8 text-xl font-semibold leading-8">
          {question.question}
        </h2>

        <div className="mt-8 space-y-4">
          {question.options.map((option, index) => {
            const selected = answers[currentQuestion] === option;

            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion]: option,
                  }))
                }
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-zinc-800 bg-[#18181b] hover:border-zinc-600"
                }`}
              >
                <span className="mr-3 font-semibold">
                  {String.fromCharCode(65 + index)}.
                </span>

                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          className="rounded-lg border border-zinc-700 px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {currentQuestion < assessment.totalQuestions - 1 ? (
          <button
            type="button"
            disabled={!answers[currentQuestion]}
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={!answers[currentQuestion]}
            onClick={handleSubmitTest}
            className="rounded-lg bg-green-600 px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
