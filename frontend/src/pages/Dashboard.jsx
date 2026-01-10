import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("token")) navigate('/maintab/chat/chatting')
    },[navigate])

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">

            {/* Header */}
            <header className="bg-blue-600 text-white py-12 text-center">
                <h1 className="text-4xl font-bold">WeChat</h1>
                <p className="mt-3 text-lg">Fast • Secure • Real-time Messaging</p>

                <button
                    onClick={() => navigate("/login")}
                    className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
                >
                    Login
                </button>
            </header>

            {/* Features */}
            <section className="py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Core Features
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    <Feature title="💬 Real-time Chat" text="Instant personal and group messaging with delivery status." />
                    <Feature title="👥 Group Chats" text="Create and manage group conversations easily." />
                    <Feature title="📞 Audio & Video Calls" text="High-quality calls using WebRTC technology." />
                    <Feature title="🟢 Online Presence" text="Live online, offline, and typing indicators." />
                    <Feature title="🔒 Secure Messaging" text="Authentication and protected data flow." />
                    <Feature title="📁 Media Sharing" text="Send images, documents, and voice notes." />
                </div>
            </section>

            {/* Importance */}
            <section className="bg-white py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Why WeChat?
                </h2>

                <ul className="max-w-xl mx-auto space-y-4 text-lg">
                    <li>🚀 Built for speed and scalability</li>
                    <li>🔁 Reliable real-time communication</li>
                    <li>🧠 Designed for modern MERN stacks</li>
                    <li>📱 Responsive on all devices</li>
                    <li>⚙️ Easy to extend and maintain</li>
                </ul>
            </section>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center py-4 mt-auto">
                © 2025 WeChat | Chat Smarter
            </footer>
        </div>
    );
};

const Feature = ({ title, text }) => (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{text}</p>
    </div>
);


export default Dashboard;
