import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  getPendingRevisionThunk,
  getRoadmapThunk,
  updateRoadmapItemCompletionThunk,
} from "../redux/roadmap/roadmapThunk";
import { createAssessmentThunk } from "../redux/assessment/assessmentThunk";
import { clearAssessmentResult } from "../redux/assessment/assessmentSlice";

const Roadmap = () => {
  const { sessionId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { roadmap, pendingRevision, loading, error } = useSelector(
    (state) => state.roadmap,
  );

  const [openDay, setOpenDay] = useState(1);
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    dispatch(getRoadmapThunk(sessionId));
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (roadmap?._id) {
      console.log("Fetching pending revision for roadmap:", roadmap._id);
      dispatch(getPendingRevisionThunk(roadmap._id));
    }
  }, [dispatch, roadmap?._id]);

  const groupedRoadmap = useMemo(() => {
    if (!roadmap?.items) return {};

    return roadmap.items.reduce((acc, item) => {
      if (!acc[item.dayNumber]) {
        acc[item.dayNumber] = [];
      }

      acc[item.dayNumber].push(item);

      return acc;
    }, {});
  }, [roadmap]);

  const handleToggleCompletion = async (item) => {
    try {
      await dispatch(
        updateRoadmapItemCompletionThunk({
          itemId: item._id,
          completed: !item.completed,
        }),
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTakeTest = async (item) => {
    setLoadingItemId(item._id);
    try {
      await dispatch(clearAssessmentResult());
      const result = await dispatch(createAssessmentThunk(item._id)).unwrap();

      navigate(`/assessment/${result._id}`);
    } catch (error) {
      console.error("Failed to create assessment:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleViewResult = (item) => {
    navigate(`/assessment/result/${item._id}`);
  };

  const completedItems =
    roadmap?.items?.filter((item) => item.completed).length || 0;

  const totalItems = roadmap?.items?.length || 0;

  const progress =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  if (loading)
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        Loading Roadmap...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-red-500">
        {error.message}
      </div>
    );

  if (!roadmap)
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        No roadmap found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* {console.log("Pending Revision:", pendingRevision)} */}
      {pendingRevision && (
        <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
          <h3 className="text-lg font-semibold text-yellow-400">
            Adaptive Roadmap Available
          </h3>

          <p className="mt-2 text-sm text-zinc-300">
            Your recent assessment identified some weak areas. We've generated
            an updated preparation plan for you.
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Assessment Score:{" "}
            <span className="font-semibold text-white">
              {pendingRevision.triggerScore}%
            </span>
          </p>

          <button
            type="button"
            onClick={() => navigate(`/roadmap/revision`)}
            className="mt-4 rounded-lg bg-yellow-500 px-5 py-2 font-medium text-black"
          >
            Review Updated Roadmap
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-zinc-400 hover:text-white"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold">Personalized Roadmap</h1>

        <p className="mt-2 text-zinc-400">
          {roadmap.totalDays} Day Preparation Plan
        </p>

        {/* Progress */}

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-[#111114] p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Overall Progress</h2>

            <span className="font-semibold">{progress}%</span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              style={{
                width: `${progress}%`,
              }}
              className="h-full bg-green-500"
            />
          </div>
        </div>

        {/* Focus Areas */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111114] p-6">
          <h2 className="text-xl font-semibold">Focus Areas</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {roadmap.focusAreas.map((area, index) => (
              <span
                key={index}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Days */}

        <div className="mt-10 space-y-5">
          {Object.entries(groupedRoadmap).map(([day, items]) => {
            const totalHours = items.reduce(
              (sum, item) => sum + item.durationHours,
              0,
            );

            const completedCount = items.filter(
              (item) => item.completed,
            ).length;

            const isOpen = openDay === Number(day);

            return (
              <div
                key={day}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111114]"
              >
                {/* HEADER */}

                <button
                  onClick={() => setOpenDay(isOpen ? null : Number(day))}
                  className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-zinc-900 transition"
                >
                  <div>
                    <h2 className="text-2xl font-semibold">Day {day}</h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      {items.length} Tasks • {totalHours} hrs
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400">
                      {completedCount}/{items.length} Completed
                    </span>

                    <span className="text-2xl">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* BODY */}

                {isOpen && (
                  <div className="space-y-5 border-t border-zinc-800 p-6">
                    {items.map((item) => {
                      const categoryColor = {
                        coding_practice:
                          "bg-blue-500/10 text-blue-400 border-blue-500/30",

                        resume_revision:
                          "bg-purple-500/10 text-purple-400 border-purple-500/30",

                        project_revision:
                          "bg-green-500/10 text-green-400 border-green-500/30",

                        cs_fundamentals:
                          "bg-orange-500/10 text-orange-400 border-orange-500/30",

                        missing_skill:
                          "bg-red-500/10 text-red-400 border-red-500/30",
                      };

                      return (
                        <div
                          key={item._id}
                          className="rounded-2xl border border-zinc-700 bg-[#18181b] p-6"
                        >
                          {/* TOP */}

                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {item.title}
                              </h3>

                              <p className="mt-3 leading-7 text-zinc-400">
                                {item.description}
                              </p>
                            </div>

                            <span
                              className={`rounded-full border px-4 py-2 text-sm capitalize ${categoryColor[item.category]}`}
                            >
                              {item.category.replaceAll("_", " ")}
                            </span>
                          </div>

                          {/* Duration */}

                          <div className="mt-5 flex items-center gap-2 text-zinc-400">
                            <span>⏱</span>

                            <span>{item.durationHours} Hours</span>
                          </div>

                          {/* Topics */}

                          <div className="mt-6">
                            <h4 className="font-semibold">Topics</h4>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.topics.map((topic, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer */}

                          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {item.hasQuiz && (
                                <button
                                  type="button"
                                  onClick={() => handleTakeTest(item)}
                                  disabled={loadingItemId === item._id}
                                  className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20 disabled:opacity-70"
                                >
                                  {loadingItemId === item._id && (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-r-transparent" />
                                  )}
                                  {loadingItemId === item._id ? "Creating..." : "Take Test"}
                                </button>
                              )}

                              {item.quizCompleted && (
                                <div className="flex items-center gap-3">
                                  <span className="rounded-full bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm text-green-400">
                                    Quiz Score: {item.quizScore}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleViewResult(item)}
                                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-800"
                                  >
                                    View Result
                                  </button>
                                </div>
                              )}
                            </div>

                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleCompletion(item)}
                                className="h-5 w-5 cursor-pointer"
                              />

                              <span>
                                {item.completed ? "Completed" : "Pending"}
                              </span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
