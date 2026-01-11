import messageContext from "./messageContext";
import { useState, useCallback, useMemo } from "react";

const StateMessage = ({ children }) => {
    const host = import.meta.env.VITE_ENDPOINT || "https://wechat-jnge.onrender.com"
    const [messages, setMessages] = useState([]);

    // Fetch messages
    const getChats = useCallback(async (userId) => {
        if (!userId) return;

        try {
            const res = await fetch(`${host}/message/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });

            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();

            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch messages failed", err);
            setMessages([]);
        }
    }, []);

    // Append message (socket-safe)
    const appendMessage = useCallback((msg) => {
        setMessages((prev) => [...prev, msg]);
    }, []);

    // Send message (optimistic)
    const sendChat = useCallback(
        async ({ loggedInUser, receiverId, content, socket, image }) => {
            if (!loggedInUser || !receiverId) return
            if (!content?.trim() && !image) return

            const tempId = Date.now()

            const tempMessage = {
                _id: tempId,
                sender: { _id: loggedInUser },
                receiver: { _id: receiverId },
                content: content || "",
                image: image ? URL.createObjectURL(image) : null,
                pending: true,
            }

            setMessages((prev) => [...prev, tempMessage])

            try {
                const formData = new FormData()
                formData.append("receiver", receiverId)
                if (content?.trim()) formData.append("content", content)
                if (image) formData.append("image", image)

                const res = await fetch(`${host}/message/send`, {
                    method: "POST",
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                    },
                    body: formData,
                })

                if (!res.ok) throw new Error("Send failed")

                const savedMessage = await res.json()
                socket?.emit("send_message", savedMessage)

                setMessages((prev) =>
                    prev.map((m) => (m._id === tempId ? savedMessage : m))
                )
            } catch (err) {
                setMessages((prev) => prev.filter((m) => m._id !== tempId))
            }
        },
        []
    )

    const value = useMemo(
        () => ({ messages, getChats, sendChat, appendMessage }),
        [messages, getChats, sendChat, appendMessage]
    );

    return (
        <messageContext.Provider value={value}>
            {children}
        </messageContext.Provider>
    );
};

export default StateMessage;
