import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getLatestCompletedAssessmentThunk } from "../redux/assessment/assessmentThunk";

const Result = () => {
  const { itemId } = useParams();
  const dispatch = useDispatch();

  const { latestCompletedAssessment, loading, error } = useSelector(
    (state) => state.assessment,
  );

  useEffect(() => {
    dispatch(getLatestCompletedAssessmentThunk(itemId));
  }, [dispatch, itemId]);

  if (loading) {
    return <div>Loading result...</div>;
  }

  if (error) {
    return <div>{error.message || "Failed to load assessment result."}</div>;
  }

  if (!latestCompletedAssessment) {
    return <div>Result not found.</div>;
  }
  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          {latestCompletedAssessment.title}
        </h1>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-[#111114] p-6">
          <p className="text-sm text-zinc-400">Assessment Result</p>

          <p className="mt-2 text-5xl font-bold">
            {latestCompletedAssessment.score}%
          </p>

          <p className="mt-2 text-zinc-400">
            {
              latestCompletedAssessment.questions.filter(
                (question) => question.userAnswer === question.correctAnswer,
              ).length
            }{" "}
            / {latestCompletedAssessment.totalQuestions} correct
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {latestCompletedAssessment.questions.map((question, index) => {
            const isCorrect = question.userAnswer === question.correctAnswer;

            return (
              <div
                key={question._id}
                className="rounded-2xl border border-zinc-800 bg-[#111114] p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    Question {index + 1}
                  </span>

                  <span
                    className={isCorrect ? "text-green-400" : "text-red-400"}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  {question.question}
                </h2>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-sm text-zinc-500">Your Answer</p>

                    <p
                      className={
                        isCorrect ? "mt-1 text-green-400" : "mt-1 text-red-400"
                      }
                    >
                      {question.userAnswer || "Not answered"}
                    </p>
                  </div>

                  {!isCorrect && (
                    <div>
                      <p className="text-sm text-zinc-500">Correct Answer</p>

                      <p className="mt-1 text-green-400">
                        {question.correctAnswer}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-zinc-800 pt-4">
                    <p className="text-sm text-zinc-500">Explanation</p>

                    <p className="mt-1 text-zinc-300">{question.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {latestCompletedAssessment.weakAreas?.length > 0 && (
  <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111114] p-6">
    <h2 className="text-xl font-semibold">
      Areas to Improve
    </h2>

    <p className="mt-2 text-sm text-zinc-400">
      These topics had an accuracy below 60% in this assessment.
    </p>

    <div className="mt-5 space-y-4">
      {latestCompletedAssessment.weakAreas.map((area) => (
        <div
          key={area._id}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {area.topic}
            </span>

            <span className="text-red-400">
              {area.accuracy}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-red-500"
              style={{ width: `${area.accuracy}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            {area.correct} / {area.total} correct
          </p>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default Result;
