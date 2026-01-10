import statusContext from "./statusContext";
import { useState, useCallback, useMemo } from "react";

const StateStatus = ({ children }) => {
    const host = import.meta.env.VITE_ENDPOINT || "http://localhost:8000";
    const [status, setStatus] = useState([]);

    // Fetch messages
    const uploadStatus = useCallback(async (statusFile) => {

        if (!statusFile) return;

        const formData = new FormData();
        formData.append("status", statusFile);

        try {
            const response = await fetch(`${host}/status/upload`, {
                method: "POST",
                headers: {
                    "auth-token": localStorage.getItem("token"),
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Fetch failed");
            const data = await response.json();
            setStatus(data);

        } catch (err) {
            console.error("Fetch to add status", err);
        }
    }, []);

    const mystatuses = useCallback(async () => {
        try {
            const response = await fetch(`${host}/status/my`, {
                method: "GET",
                headers: {
                    "auth-token": localStorage.getItem("token"),
                }
            });

            if (!response.ok) throw new Error("Fetch failed");
            const data = await response.json();
            return data;

        } catch (err) {
            console.error("Fetch to add status", err);
        }
    }, []);

    const statusGet = useCallback(async () => {
        try {
            const response = await fetch(`${host}/status/feed`, {
                method: "GET",
                headers: {
                    "auth-token": localStorage.getItem("token"),
                }
            });

            if (!response.ok) throw new Error("Fetch failed");
            const data = await response.json();
            return data;

        } catch (err) {
            console.error("Fetch to add status", err);
        }
    })

    const statusGetseen = useCallback(async (id) => {
        try {
            const response = await fetch(`${host}/status/seen/${id}`, {
                method: "PUT",
                headers: {
                    "auth-token": localStorage.getItem("token"),
                }
            });

            if (!response.ok) throw new Error("Fetch failed");

            return await response.json();

        } catch (err) {
            console.error("Fetch to add status", err);
        }
    }, [host]);

    const deleteStatus = useCallback(async (id) => {
        try {
            const response = await fetch(`${host}/status/${id}`, {
                method: "DELETE",
                headers: {
                    "auth-token": localStorage.getItem("token"),
                }
            });

            if (!response.ok) throw new Error("Fetch failed");

            return await response.json();

        } catch (err) {
            console.error("Fetch to add status", err);
        }
    }, [host])


    const value = useMemo(
        () => ({ status, uploadStatus, mystatuses, statusGet, statusGetseen, deleteStatus }),
        [status, uploadStatus, mystatuses, statusGet, statusGetseen, deleteStatus]
    );

    return (
        <statusContext.Provider value={value}>
            {children}
        </statusContext.Provider>
    );
};

export default StateStatus;
