import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import logo2Icon from "../assets/wechat-svgrepo-com.svg";
import chatIcon from "../assets/message-54.svg";
import callIcon from "../assets/call-9.svg";
import statusIcon from "../assets/status-5.svg";
import settingIcon from "../assets/settings-5672.svg";

import CallPage from "./CallPage";
import StatusPage from "./StatusPage";
import ContactList from "./ContactList";

const VALID_TABS = ["chat", "status", "call"];

const Maintab = () => {
    const { tab } = useParams();          // 👈 read from URL
    const navigate = useNavigate();
    const [showSettingToast, setShowSettingToast] = useState(false);

    // 🔐 Auth guard
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
    }, [navigate]);

    // ❌ Invalid tab → redirect to chat
    useEffect(() => {
        if (!VALID_TABS.includes(tab)) {
            navigate("/maintab/chat/chatting", { replace: true });
        }
    }, [tab, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="h-screen flex bg-gray-100 relative">
            {/* Sidebar */}
            <aside className="w-20 bg-blue-400 flex flex-col items-center py-4 text-white">
                <img src={logo2Icon} alt="logo" className="mb-10 w-15 h-15" />

                <SidebarItem
                    icon={chatIcon}
                    label="Chat"
                    active={tab === "chat"}
                    onClick={() => navigate("/maintab/chat/chatting")}
                />

                <SidebarItem
                    icon={statusIcon}
                    label="Status"
                    active={tab === "status"}
                    onClick={() => navigate("/maintab/status/status")}
                />

                <SidebarItem
                    icon={callIcon}
                    label="Calls"
                    active={tab === "call"}
                />

                {/* Settings */}
                <div className="mt-auto relative">
                    <SidebarItem
                        icon={settingIcon}
                        label="Setting"
                        onClick={() => setShowSettingToast(!showSettingToast)}
                    />

                    {showSettingToast && (
                        <div className="absolute left-20 bottom-2 w-40 bg-white shadow-lg rounded-lg p-3 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Pages */}
            <div className="flex-1 overflow-hidden">
                {tab === "chat" && <ContactList />}
                {tab === "status" && <StatusPage />}
                {tab === "call" && <CallPage />}
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className="flex flex-col py-3 items-center cursor-pointer"
    >
        <img
            src={icon}
            alt={label}
            className={`w-12 h-12 p-2 rounded-full hover:bg-blue-200 ${
                active ? "bg-blue-200" : ""
            }`}
        />
        <span className="text-xs text-black font-medium mt-1">
            {label}
        </span>
    </div>
);

export default Maintab;