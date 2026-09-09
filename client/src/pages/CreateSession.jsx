import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSessionThunk } from "../redux/session/sessionThunk";

const CreateSession = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.session);
    const { user } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        companyName: "",
        roleName: "",
        timeAvailableDays: "",
    });

    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.companyName ||
            !form.roleName ||
            !form.timeAvailableDays ||
            !resume ||
            !jobDescription
        ) {
            setError("Please fill all fields.");
            return;
        }

        if (!user?._id) {
            setError("User not authenticated. Please log in again.");
            return;
        }

        setError("");

        const data = new FormData();

        data.append("user", user._id);
        data.append("companyName", form.companyName);
        data.append("roleName", form.roleName);
        data.append("timeAvailableDays", form.timeAvailableDays);
        data.append("resume", resume);
        data.append("jobDescription", jobDescription);

        try {
            const session = await dispatch(createSessionThunk(data)).unwrap();

            navigate(`/dashboard/${session._id}`);
        } catch (err) {
            setError(err?.message || "Unable to create session.");
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex justify-center px-6 py-12">

            <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-[#111114] p-10">

                <h1 className="text-3xl font-bold">
                    Create Preparation Session
                </h1>

                <p className="mt-2 text-zinc-400">
                    Upload your resume and job description to begin AI-powered preparation.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 space-y-6"
                >

                    <div>
                        <label className="mb-2 block text-sm">
                            Company Name
                        </label>

                        <input
                            type="text"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            placeholder="Amazon"
                            className="w-full rounded-xl border border-zinc-700 bg-[#09090b] p-3 outline-none focus:border-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm">
                            Role Name
                        </label>

                        <input
                            type="text"
                            name="roleName"
                            value={form.roleName}
                            onChange={handleChange}
                            placeholder="SDE Intern"
                            className="w-full rounded-xl border border-zinc-700 bg-[#09090b] p-3 outline-none focus:border-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm">
                            Time Available (Days)
                        </label>

                        <input
                            type="number"
                            min="1"
                            name="timeAvailableDays"
                            value={form.timeAvailableDays}
                            onChange={handleChange}
                            placeholder="20"
                            className="w-full rounded-xl border border-zinc-700 bg-[#09090b] p-3 outline-none focus:border-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm">
                            Resume
                        </label>

                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={(e) => setResume(e.target.files[0])}
                            className="block w-full rounded-xl border border-zinc-700 bg-[#09090b] p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm">
                            Job Description
                        </label>

                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={(e) =>
                                setJobDescription(e.target.files[0])
                            }
                            className="block w-full rounded-xl border border-zinc-700 bg-[#09090b] p-3"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create Session"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreateSession;