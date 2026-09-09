import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getSessionsThunk } from "../redux/session/sessionThunk";
import SessionCard from "../components/SessionCard";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        sessions,
        loading,
        error,
    } = useSelector((state) => state.session);

    useEffect(() => {
        dispatch(getSessionsThunk());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[#09090b] text-white">

            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* Header */}

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h1 className="text-4xl font-bold">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-zinc-400">
                            Manage your personalized interview preparation
                            sessions.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/session")}
                        className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
                    >
                        + New Preparation
                    </button>

                </div>

                {/* Loading */}

                {loading && (
                    <div className="mt-16 flex justify-center">

                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white"></div>

                    </div>
                )}

                {/* Error */}

                {!loading && error && (
                    <div className="mt-10 rounded-2xl border border-red-600/30 bg-red-500/10 p-6">

                        <h2 className="text-lg font-semibold text-red-400">
                            Failed to load sessions
                        </h2>

                        <p className="mt-2 text-sm text-zinc-300">
                            {error.message || "Something went wrong."}
                        </p>

                    </div>
                )}

                {/* Empty State */}

                {!loading &&
                    !error &&
                    sessions.length === 0 && (
                        <div className="mt-20 rounded-3xl border border-dashed border-zinc-700 p-12 text-center">

                            <div className="text-6xl">
                                🚀
                            </div>

                            <h2 className="mt-6 text-2xl font-semibold">
                                No Preparation Sessions Yet
                            </h2>

                            <p className="mt-3 text-zinc-400">
                                Create your first AI-powered interview
                                preparation session and start your journey.
                            </p>

                            <button
                                onClick={() => navigate("/session")}
                                className="mt-8 rounded-xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-zinc-200"
                            >
                                Start New Preparation
                            </button>

                        </div>
                    )}

                {/* Sessions */}

                {!loading &&
                    !error &&
                    sessions.length > 0 && (
                        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                            {sessions.map((session) => (
                                <SessionCard
                                    key={session._id}
                                    session={session}
                                />
                            ))}

                        </div>
                    )}

            </div>

        </div>
    );
};

export default Dashboard;