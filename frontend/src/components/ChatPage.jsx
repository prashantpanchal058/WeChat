import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import io from "socket.io-client";

import Message from "./Message";
import messageContext from "../context/message/messageContext";

import callIcon from "../assets/call-9.svg";
import videoIcon from "../assets/video-call-12.svg";
import avatarIcon from "../assets/avatar-svgrepo-com.svg";
import openIcon from "../assets/open.svg";

const ChatPage = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { id } = useParams();
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    const ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:8000";

    const { messages = [], getChats, sendChat, appendMessage } =
        useContext(messageContext);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [typing, setTyping] = useState(false);
    const [image, setImage] = useState(null)

    const activeChatRef = useRef(null);

    useEffect(() => { activeChatRef.current = activeChat?._id || null; }, [activeChat?._id]);

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const getLoggedInUser = async () => {
            try {
                const res = await fetch(`${ENDPOINT}/auth/getuser`, {
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                });
                const data = await res.json();
                setLoggedInUser(data);
            } catch (err) {
                console.error("Failed to fetch logged-in user", err);
            }
        };

        getLoggedInUser();
    }, []);

    useEffect(() => {
        if (!loggedInUser?._id) return;

        socketRef.current = io(ENDPOINT, { withCredentials: true });
        socketRef.current.emit("join", loggedInUser._id);

        const handleReceiveMessage = (msg) => {
            if (
                msg.sender?._id === activeChatRef.current ||
                msg.receiver?._id === activeChatRef.current
            ) {
                appendMessage(msg);
            }
        };

        const handleTyping = (senderId) => {
            if (senderId === activeChatRef.current) {
                setTyping(true);
            }
        };

        const handleStopTyping = (senderId) => {
            if (senderId === activeChatRef.current) {
                setTyping(false);
            }
        };

        socketRef.current.on("receive_message", handleReceiveMessage);
        socketRef.current.on("typing", handleTyping);
        socketRef.current.on("stop_typing", handleStopTyping);

        return () => {
            socketRef.current.off("receive_message", handleReceiveMessage);
            socketRef.current.off("typing", handleTyping);
            socketRef.current.off("stop_typing", handleStopTyping);
            socketRef.current.disconnect();
        };
    }, [loggedInUser?._id]);

    // Fetch active chat user
    useEffect(() => {
        if (id === "chatting") {
            setActiveChat(null)
            return
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`${ENDPOINT}/auth/getuser/${id}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await res.json()
                setActiveChat(data)
            } catch (error) {
                console.error("Failed to fetch user", error)
                setActiveChat(null)
            }
        }

        fetchUser()
    }, [id])


    // Fetch messages
    useEffect(() => {
        if (!activeChat?._id) return;
        setLoading(true);
        getChats(activeChat._id).finally(() => setLoading(false));
    }, [activeChat?._id, getChats]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        sendChat({
            loggedInUser: loggedInUser._id,
            receiverId: activeChat._id,
            content: message,
            socket: socketRef.current,
            image: image
        });
        setMessage("");
        setImage(null);
    };

    const changeSidebar = (() => {
        if (isSidebarOpen) setIsSidebarOpen(false);
        else setIsSidebarOpen(true);
    })

    if (!activeChat) {
        return (
            <main className="flex-1 flex items-center justify-center bg-blue-200">
                Select a chat
            </main>
        );
    }

    const inputchange = ((e) => {
        const value = e.target.value; setMessage(value); if (!socketRef.current || !loggedInUser || !activeChat) return;
        if (!isTypingRef.current) {
            socketRef.current.emit("typing", {
                sender: loggedInUser._id,
                receiver: activeChat._id,
            });
            isTypingRef.current = true;
        }
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit("stop_typing", {
                sender: loggedInUser._id, receiver: activeChat._id,
            }); isTypingRef.current = false;
        }, 1500);
    })

    const handleImageChange = (e) => {
        setImage(e.target.files[0])
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };


    return (
        <main className="flex-1 flex flex-col">
            {/* HEADER */}
            <header className="bg-blue-300 p-3 flex justify-between items-center">
                <div className="flex gap-4 items-center ms-4">
                    {!isSidebarOpen && <button onClick={changeSidebar}>
                        <img src={openIcon} alt="toggle" width="25" height="25" />
                    </button>}
                    <img
                        src={activeChat.pic || avatarIcon}
                        className={`w-12 h-12 ${activeChat.pic ? "" : "p-2"} rounded-full bg-blue-200 object-cover`}
                    />
                    <div>
                        <h2 className="font-semibold">{activeChat.name}</h2>
                        {typing && <p className="text-sm italic">{activeChat.name} is typing…</p>}
                    </div>
                </div>
                <div className="flex gap-4 items-center me-4">
                    <img src={callIcon} alt="call" className="w-6 cursor-pointer" />
                    <img src={videoIcon} alt="video" className="w-6 cursor-pointer" />
                    <MoreVertical />
                </div>
            </header>

            {/* MESSAGES */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-blue-200">
                {loading && (
                    <p className="text-center text-gray-600">
                        Loading messages...
                    </p>
                )}

                {!loading && messages.length === 0 && (
                    <p className="text-center text-gray-600">No messages</p>
                )}

                {messages.map((msg) => (
                    <Message
                        key={msg._id}
                        text={msg.content}
                        image={msg.image}
                        type={
                            msg.sender?._id === loggedInUser?._id
                                ? "sent"
                                : "received"
                        }
                        createdAt={msg.createdAt}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <footer className="p-4 bg-blue-200 px-4 sm:px-6 md:px-20 lg:px-40 flex gap-2">
                <label className="bg-blue-400 h-12 px-4 rounded-full text-white flex items-center cursor-pointer">
                    📷
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>

                <div className="relative flex-1">
                    {image && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-blue-300 px-2 py-1 rounded-full">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="w-8 h-8 rounded object-cover"
                            />
                            <button
                                onClick={() => setImage(null)}
                                className="text-red-600 font-bold text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <input
                        value={message}
                        onChange={inputchange}
                        onKeyDown={handleKeyDown}
                        placeholder={image ? "Add a caption…" : "Type a message"}
                        className={`
                w-full
                h-12
                pr-6
                rounded-full
                bg-blue-400
                outline-none
                text-white
                placeholder-white
                ${image ? "pl-22" : "pl-10"}
            `}
                    />
                </div>

                <button
                    onClick={handleSend}
                    className="bg-blue-400 h-12 px-6 rounded-full text-white"
                >
                    ➤
                </button>
            </footer>

        </main>
    );
};

export default ChatPage;
