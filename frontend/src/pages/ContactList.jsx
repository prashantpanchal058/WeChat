import React, { useEffect, useState } from "react";
import avatarIcon from "../assets/avatar-svgrepo-com.svg";
import ChatPage from "../components/ChatPage";
import { useNavigate, useParams } from "react-router-dom";

const ContactList = () => {
    const [contactLists, setContactList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const host = import.meta.env.VITE_ENDPOINT || "https://wechat-jnge.onrender.com";

    const { id } = useParams();
    const navigate = useNavigate();

    /* ================= RESPONSIVE SIDEBAR ================= */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false); // mobile
            } else {
                setIsSidebarOpen(true); // desktop
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ================= FETCH USERS ================= */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!localStorage.getItem("token")) return;

                const response = await fetch(
                    `${host}/auth/getusers`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": localStorage.getItem("token"),
                        },
                    }
                );

                const json = await response.json();
                setContactList(json);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg font-medium">Loading contacts...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-gray-100 relative overflow-hidden">
            {/* ================= SIDEBAR ================= */}
            {isSidebarOpen && (
                <section
                    className="
                        bg-blue-300 flex flex-col
                        w-full md:w-96
                        fixed md:relative
                        inset-0 md:inset-auto
                        z-50 md:z-auto
                    "
                >
                    {/* Search */}
                    <div className="p-5 flex gap-2">
                        <input
                            placeholder="Search chats"
                            className="w-full px-3 py-2 rounded bg-blue-100 outline-none"
                        />
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto mx-3 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-200">
                        {contactLists.length === 0 && (
                            <p className="text-center text-gray-600 mt-10">
                                No contacts found
                            </p>
                        )}

                        {contactLists.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => {
                                    navigate(`/maintab/chat/${chat._id}`);
                                    if (window.innerWidth < 768) {
                                        setIsSidebarOpen(false);
                                    }
                                }}
                                className={`px-4 py-3 mb-1 h-20 cursor-pointer rounded-3xl flex items-center gap-3 hover:bg-blue-200
                                ${id === chat._id ? "bg-blue-200" : ""}`}
                            >
                                <img
                                    src={chat.pic || avatarIcon}
                                    alt={avatarIcon}
                                    className={`w-12 h-12 ${chat.pic? "": "p-2"} rounded-full bg-blue-200 object-cover`}
                                />

                                <div className="flex-1">
                                    <p className="font-medium">{chat.name}</p>
                                </div>

                                {chat.online && (
                                    <span className="h-2 w-2 bg-green-500 rounded-full" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ================= CHAT PAGE ================= */}
            <ChatPage
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
        </div>
    );
};

export default ContactList;
