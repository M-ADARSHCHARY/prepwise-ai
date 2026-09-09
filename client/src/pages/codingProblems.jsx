import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { generateCodingProblemsThunk } from "../redux/codingProblem/codingProblemThunk";

const CodingProblems = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch();

  const { recommendations, loading, error } = useSelector(
    (state) => state.codingProblem,
  );

  useEffect(() => {
    if (sessionId) {
      dispatch(generateCodingProblemsThunk(sessionId))
        .unwrap()
        .then(() => toast.success("Coding problems are ready."))
        .catch((message) => toast.error(message || "Failed to generate coding problems."));
    }
  }, [dispatch, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
            <h1 className="text-3xl font-bold">Finding Coding Problems...</h1>
          </div>

          <p className="mt-2 text-zinc-400">
            Finding problems relevant to the company and job description.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-red-400">
            Failed to load problems
          </h1>

          <p className="mt-2 text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold">
          Recommended Coding Problems
        </h1>

        <p className="mt-2 text-zinc-400">
          Problems selected based on your company and job description.
        </p>

        <div className="mt-8 space-y-4">
          {recommendations.map((problem, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-800 bg-[#111114] p-6"
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500">
                      #{problem.problemNumber || "—"}
                    </span>

                    <h2 className="text-xl font-semibold">
                      {problem.title}
                    </h2>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {problem.platform}
                    </span>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {problem.pattern}
                    </span>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <p className="mt-8 text-zinc-400">
            No coding problems found.
          </p>
        )}

      </div>
    </div>
  );
};

export default CodingProblems;