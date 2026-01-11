import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OpenEye from "../components/OpenEye";
import CloseEye from "../components/CloseEye";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pic, setPic] = useState(null)

    const navigate = useNavigate();

    const host = import.meta.env.VITE_ENDPOINT || "https://wechat-jnge.onrender.com";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmitbtn = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        if (pic) formData.append("pic", pic);

        try {
            const response = await fetch(`${host}/auth/createuser`, {
                method: 'POST',
                body: formData
            });

            const json = await response.json()

            console.log(json)

            if (json.success) {
                localStorage.setItem('token', json.authtoken);
                navigate("/maintab/chat/chatting");
            }

        } catch (error) {
            console.error("Error in signup:", error);
        }
    };

    const handleFileChange = (e) => {
        setPic(e.target.files[0]);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md px-8 py-3">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 text-sm">
                        Join us and get started in minutes
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitbtn} className="space-y-3">
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                autoComplete="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    // Eye with slash (hide)
                                    <OpenEye />
                                ) : (
                                    <CloseEye />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                autoComplete="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirm ? (
                                    <OpenEye />
                                ) : (
                                    <CloseEye />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="pic" className="block text-sm font-medium text-gray-700 p-1">
                            Profile Picture
                        </label>

                        <div>

                            <input
                                type="file"
                                className="form-control border-2 rounded-2xl p-1"
                                id="pic"
                                name="pic"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-3">
                    <div className="grow h-px bg-gray-300"></div>
                    <span className="px-2 text-gray-400 text-sm">or</span>
                    <div className="grow h-px bg-gray-300"></div>
                </div>

                {/* Social Signup */}
                <div className="flex flex-col space-y-3">
                    <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                            alt="Google"
                        />
                        <span>Sign up with Google</span>
                    </button>
                </div>

                {/* Login link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;