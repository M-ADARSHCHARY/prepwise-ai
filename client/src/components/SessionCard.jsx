import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteSessionThunk } from "../redux/session/sessionThunk";

const statusStyles = {
    pending: {
        label: "Pending Analysis",
        className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
    processing: {
        label: "Analyzing...",
        className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    completed: {
        label: "Analysis Completed",
        className: "bg-green-500/15 text-green-400 border-green-500/30",
    },
    failed: {
        label: "Analysis Failed",
        className: "bg-red-500/15 text-red-400 border-red-500/30",
    },
};

const SessionCard = ({ session }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDeleteSessionById = async () => {
        
        try {
            await dispatch(deleteSessionThunk(session?._id)).unwrap();
            alert("Session deleted successfully.");
        } catch (error) {
            console.log("Error deleting session:", error);
        }
    }

    const status =
        statusStyles[session.analysisStatus] || statusStyles.pending;

    return (
        <div className="rounded-3xl border border-zinc-800 bg-[#111114] p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20">

            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-xl font-semibold text-white">
                        {session.companyName}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                        {session.roleName}
                    </p>
                </div>

                <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                >
                    {status.label}
                </span>
            </div>

            <div className="mt-6 space-y-2 text-sm text-zinc-400">

                <div className="flex justify-between">
                    <span>Preparation Days</span>
                    <span className="text-white">
                        {session.timeAvailableDays} Days
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Created</span>
                    <span className="text-white">
                        {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                </div>

            </div>

            <div className="mt-8 w-full rounded-xl bg-transparent py-3 font-semibold text-black transition flex gap-2">
                <button
                    onClick={() => navigate(`/dashboard/${session._id}`)}
                    className="w-[80%] rounded-xl hover:bg-blue-500 py-3 font-semibold text-black transition cursor-pointer bg-zinc-200"
                    >
                    Continue
                </button>
                <button onClick={handleDeleteSessionById} className="px-2 rounded-xl bg-red-600 py-2 font-semibold text-white cursor-pointer transition hover:bg-red-700">
                    Delete
                </button>
                </div>

        </div>
    );
};

export default SessionCard;