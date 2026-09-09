import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { applyPendingRevisionThunk, rejectPendingRevisionThunk } from "../redux/roadmap/roadmapThunk";

const RoadmapRevision = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { roadmap, pendingRevision, loading } = useSelector(
    (state) => state.roadmap,
  );

  const handleApplyRevision = async () => {
    try {
      await dispatch(applyPendingRevisionThunk(roadmap._id)).unwrap();

      navigate(`/roadmap/${roadmap.session}`);
    } catch (error) {
      console.log("Failed to apply roadmap revision:", error);
    }
  };

  const handleRejectRevision = async () => {
    try {
      await dispatch(rejectPendingRevisionThunk(roadmap._id)).unwrap();
    } catch (error) {
      console.log("Failed to reject roadmap revision:", error);
    }
  };
  if (!pendingRevision) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8 text-center">
            <p className="text-zinc-400">No adaptive roadmap available.</p>
          </div>
        </div>
      </div>
    );
  }

  const revision = pendingRevision.data;

  return (
    <div className="min-h-screen bg-[#09090b] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            AI Roadmap Adaptation
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your Updated Roadmap
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Your roadmap has been redesigned based on your recent assessment
            performance. Review the changes before applying them.
          </p>
        </div>

        {/* Assessment Summary */}
        <div className="mb-10 grid gap-4 md:grid-cols-[220px_1fr]">
          {/* Score */}
          <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Assessment Score
            </p>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-5xl font-bold tracking-tight text-red-400">
                {pendingRevision.triggerScore}
              </span>

              <span className="mb-1 text-xl text-zinc-600">%</span>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-red-400"
                style={{
                  width: `${pendingRevision.triggerScore}%`,
                }}
              />
            </div>
          </div>

          {/* Reason */}
          <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                !
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Why was your roadmap adapted?
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {pendingRevision.reason}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Focus Areas</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Areas identified as priorities for your preparation.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {revision.focusAreas?.map((area, index) => (
              <div
                key={index}
                className="group rounded-xl border border-zinc-800 bg-[#111113] p-5 transition hover:border-zinc-700 hover:bg-[#141416]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm leading-6 text-zinc-300">{area}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Updated Plan */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Updated Plan</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your personalized preparation plan for the coming days.
            </p>
          </div>

          <div className="space-y-4">
            {revision.items?.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800 bg-[#111113] p-5 transition hover:border-zinc-700 sm:p-6"
              >
                {/* Top row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    {/* Day number */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-sm font-semibold text-zinc-300">
                      {item.dayNumber}
                    </div>

                    <div>
                      <h3 className="font-semibold text-zinc-100">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                          Day {item.dayNumber}
                        </span>

                        <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs capitalize text-blue-400">
                          {item.category?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="shrink-0 rounded-lg border border-zinc-800 px-3 py-2">
                    <span className="text-xs text-zinc-500">Duration</span>

                    <p className="mt-0.5 text-sm font-medium text-zinc-300">
                      {item.durationHours} hrs
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-5 border-t border-zinc-800 pt-5">
                  <p className="text-sm leading-6 text-zinc-500">
                    {item.description}
                  </p>
                </div>

                {/* Topics */}
                {item.topics?.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Topics
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="rounded-lg border border-zinc-800 bg-[#0c0c0e] px-3 py-1.5 text-xs text-zinc-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Action */}
        <div className="sticky bottom-4 z-10 mt-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-[#111113]/95 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Ready to update your roadmap?
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Your current roadmap will be replaced with this adapted plan.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleApplyRevision}
              className="whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Applying...
                </span>
              ) : (
                "Apply Updated Roadmap"
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleRejectRevision}
              className="rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Rejecting..." : "Don't Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapRevision;
