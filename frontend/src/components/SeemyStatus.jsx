import React, { useEffect, useState, useContext } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import statusContext from "../context/status/statusContext";

const SeemyStatus = ({ activeStatus = [] }) => {
    const { deleteStatus } = useContext(statusContext);
    
    const ENDPOINT = import.meta.env.VITE_ENDPOINT || "https://wechat-jnge.onrender.com";

    const [statuses, setStatuses] = useState([]);
    const [index, setIndex] = useState(0);

    // Sync prop → local state
    useEffect(() => {
        if (Array.isArray(activeStatus) && activeStatus.length) {
            setStatuses(activeStatus);
            setIndex(0);
        }
    }, [activeStatus]);

    const currentStatus = statuses[index] ?? null;

    // Auto-advance images
    useEffect(() => {
        if (!currentStatus || currentStatus.type !== "image") return;

        const timer = setTimeout(() => {
            if (index < statuses.length - 1) {
                setIndex(i => i + 1);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [currentStatus, index, statuses.length]);

    const goNext = () => {
        if (index < statuses.length - 1) setIndex(i => i + 1);
    };

    const goPrev = () => {
        if (index > 0) setIndex(i => i - 1);
    };

    const handleDelete = async () => {
        if (!currentStatus) return;

        const id = currentStatus._id;

        // Optimistic UI update
        setStatuses(prev => prev.filter((_, i) => i !== index));
        setIndex(i => (i > 0 ? i - 1 : 0));

        await deleteStatus(id);
    };

    if (!statuses.length) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                No status
            </div>
        );
    }

    if (!currentStatus) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                Loading status...
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
            {/* Progress */}
            <div className="flex gap-1 p-2 z-20">
                {statuses.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded ${i <= index ? "bg-white" : "bg-gray-600"
                            }`}
                    />
                ))}
            </div>

            {/* Delete */}
            <button
                onClick={handleDelete}
                className="absolute top-4 right-4 z-30 bg-black/50 p-2 rounded-full text-white hover:bg-red-600"
            >
                <Trash2 size={18} />
            </button>

            {/* Media */}
            <div className="relative w-full h-full max-w-full overflow-hidden flex items-center justify-center">


                {currentStatus.type === "image" ? (
                    <img
                        src={`${ENDPOINT}${currentStatus.content}`}
                        className="max-h-full max-w-full object-contain"
                        alt=""
                    />
                ) : (
                    <video
                        src={`${ENDPOINT}${currentStatus.content}`}
                        autoPlay
                        muted
                        onEnded={goNext}
                        className="max-h-full max-w-full"
                    />
                )}

                {index > 0 && (
                    <div
                        onClick={goPrev}
                        className="absolute left-0 top-0 h-full w-1/3 flex items-center pl-4 cursor-pointer"
                    >
                        <ChevronLeft size={32} className="text-white bg-black/40 rounded-full p-1" />
                    </div>
                )}

                {index < statuses.length - 1 && (
                    <div
                        onClick={goNext}
                        className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-end pr-4 cursor-pointer"
                    >
                        <ChevronRight size={32} className="text-white bg-black/40 rounded-full p-1" />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 text-white text-xs opacity-70 text-center">
                {index + 1} / {statuses.length}
            </div>
        </div>
    );
};

export default SeemyStatus;
