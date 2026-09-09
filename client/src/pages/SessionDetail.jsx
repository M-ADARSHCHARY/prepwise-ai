import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  analyzeSessionThunk,
  getSessionByIdThunk,
} from "../redux/session/sessionThunk";
import {
  generateRoadmapThunk,
  getRoadmapThunk,
} from "../redux/roadmap/roadmapThunk";

const statusConfig = {
  pending: {
    label: "Pending Analysis",
    className: "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",
  },
  processing: {
    label: "Analyzing Resume...",
    className: "bg-blue-500/10 border border-blue-500/30 text-blue-400",
  },
  completed: {
    label: "Analysis Completed",
    className: "bg-green-500/10 border border-green-500/30 text-green-400",
  },
  failed: {
    label: "Analysis Failed",
    className: "bg-red-500/10 border border-red-500/30 text-red-400",
  },
};

const priorityColor = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [roadmapAction, setRoadmapAction] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { session, loading, error } = useSelector((state) => state.session);

  const handleGenerateRoadmap = async () => {
    if (roadmapAction) return;

    setRoadmapAction("generating");
    try {
      await dispatch(generateRoadmapThunk(session._id)).unwrap();
      toast.success("Roadmap generated successfully.");
      navigate(`/roadmap/${session._id}`);
    } catch (err) {
      toast.error(err?.message || "Unable to generate roadmap.");
    } finally {
      setRoadmapAction(null);
    }
  };

  useEffect(() => {
    dispatch(getSessionByIdThunk(sessionId));
  }, [dispatch, sessionId]);

  const handleAnalyze = async () => {
    try {
      await dispatch(analyzeSessionThunk(sessionId)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoToRoadmap = async () => {
    if (roadmapAction) return;

    setRoadmapAction("opening");
    try {
      await dispatch(getRoadmapThunk(session._id)).unwrap();
      navigate(`/roadmap/${session._id}`);
    } catch (err) {
      toast.error(err?.message || "Unable to open roadmap.");
    } finally {
      setRoadmapAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-red-400">
        {error.message || "Something went wrong."}
      </div>
    );
  }

  if (!session) return null;

  const status = statusConfig[session.analysisStatus] || statusConfig.pending;
//   console.log(session)
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 text-zinc-400 hover:text-white transition"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-3xl border border-zinc-800 bg-[#111114] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">{session.companyName}</h1>

              <p className="mt-2 text-xl text-zinc-400">{session.roleName}</p>

              <p className="mt-4 text-sm text-zinc-500">
                {session.timeAvailableDays} Day Preparation Plan
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* ATS CARD */}

            <div className="rounded-2xl border border-zinc-800 bg-[#18181b] p-6 flex flex-col items-center justify-center">
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                ATS Score
              </p>

              <h2 className="mt-3 text-6xl font-bold text-green-400">
                {session.atsScore}%
              </h2>

              <p className="mt-3 text-sm text-zinc-400 text-center">
                Resume Match Score
              </p>
            </div>

            {/* AI SUMMARY */}

            <div className="rounded-2xl border border-zinc-800 bg-[#18181b] p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold">AI Summary</h2>

              <p className="mt-4 leading-7 text-zinc-300">
                {session.aiSummary}
              </p>
            </div>
          </div>

          {/* SKILLS */}

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* MATCHED */}

            <div className="rounded-2xl border border-zinc-800 bg-[#18181b] p-6">
              <h2 className="text-xl font-semibold mb-5">✅ Matched Skills</h2>

              <div className="flex flex-wrap gap-3">
                {session.matchedSkills.length > 0 ? (
                  session.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm text-green-400"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-zinc-500">No matched skills found.</p>
                )}
              </div>
            </div>

            {/* MISSING */}

            <div className="rounded-2xl border border-zinc-800 bg-[#18181b] p-6">
              <h2 className="text-xl font-semibold mb-5">⚠ Missing Skills</h2>

              <div className="space-y-4">
                {session.missingSkills.length > 0 ? (
                  session.missingSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center rounded-xl bg-[#111114] px-4 py-3"
                    >
                      <div>
                        <p className="font-medium">{skill.skill}</p>

                        {skill.note && (
                          <p className="mt-1 text-sm text-zinc-500">
                            {skill.note}
                          </p>
                        )}
                      </div>

                      <span
                        className={`capitalize font-semibold ${priorityColor[skill.priority]}`}
                      >
                        {skill.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500">No missing skills 🎉</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Improvements */}

          <div className="mt-10 rounded-2xl border border-zinc-800 bg-[#18181b] p-6">
            <h2 className="text-xl font-semibold mb-6">Resume Improvements</h2>
            <div className="space-y-5">
              {session.resumeImprovements.length > 0 ? (
                session.resumeImprovements.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-700 bg-[#111114] p-5"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {item.section}
                    </h3>

                    <p className="mt-2 leading-7 text-zinc-400">
                      {item.suggestion}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500">No suggestions available.</p>
              )}
            </div>
          </div>

          {/* ACTION BUTTON */}

          <div className="mt-10 flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
            {session.analysisStatus !== "completed" ? (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            ) : session && session.roadmapExists ? (
              <button
                onClick={handleGoToRoadmap}
                disabled={roadmapAction !== null}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-center font-semibold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {roadmapAction === "opening" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Opening Roadmap...
                  </span>
                ) : (
                  "Open Roadmap →"
                )}
              </button>
            ) : (
              <button
                onClick={handleGenerateRoadmap}
                disabled={roadmapAction !== null}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-center font-semibold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {roadmapAction === "generating" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating Roadmap...
                  </span>
                ) : (
                  "Generate Roadmap →"
                )}
              </button>
            )}
            
            <button
              type="button"
              onClick={() => navigate(`/coding-problems/${sessionId}`)}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
            >
              Coding Problems →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
