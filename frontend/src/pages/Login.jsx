import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import OpenEye from "../components/OpenEye";
import CloseEye from "../components/CloseEye";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const host = import.meta.env.VITE_ENDPOINT || "https://wechat-jnge.onrender.com";

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${host}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json()

            if (json.success) {
                localStorage.setItem('token', json.authtoken);
                navigate("/maintab/chat/chatting");
            }

        } catch (error) {
            console.error("Error in signin:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Please log in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <OpenEye/>
                                ) : (
                                    <CloseEye/>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember me + Forgot password */}
                    <div className="flex items-center justify-between text-sm">
                        <Link to="#" className="text-blue-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Log In
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <div className="grow h-px bg-gray-300"></div>
                    <span className="px-2 text-gray-400 text-sm">or</span>
                    <div className="grow h-px bg-gray-300"></div>
                </div>

                {/* Social Login */}
                <div className="flex flex-col space-y-3">
                    <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                            alt="Google"
                        />
                        <span>Continue with Google</span>
                    </button>
                </div>

                {/* Signup link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;