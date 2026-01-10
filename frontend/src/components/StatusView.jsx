import React, { useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import statusContext from "../context/status/statusContext";

const StatusView = ({ activeStatus }) => {
    const [index, setIndex] = useState(0);
    const seenRef = useRef(new Set());

    const ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:8000"

    // ✅ SAFE: this runs every render
    const currentStatus = activeStatus?.statuses?.[index];
    const { statusGetseen } = useContext(statusContext);

    // IMAGE AUTO-ADVANCE ONLY
    useEffect(() => {
        if (!activeStatus) return;
        if (!currentStatus) return;
        if (currentStatus.type !== "image") return;

        // statusGetseen(currentStatus._id)
        const timer = setTimeout(() => {
            if (index < activeStatus.statuses.length - 1) {
                setIndex(prev => prev + 1);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [index, currentStatus, activeStatus]);

    useEffect(() => {
        if (!currentStatus) return;

        if (seenRef.current.has(currentStatus._id)) return;

        seenRef.current.add(currentStatus._id);
        statusGetseen(currentStatus._id);
    }, [currentStatus]);

    // ✅ NOW it’s safe to return conditionally
    if (!activeStatus) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <p className="text-lg font-medium">No status selected</p>
                <p className="text-sm">Click a status to view updates</p>
            </div>
        );
    }

    const goNext = () => {
        // statusGetseen(currentStatus._id)
        if (index < activeStatus.statuses.length - 1) {
            setIndex(index + 1);
        }
    };

    const goPrev = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    return (
        <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
            {/* Progress Bars */}
            <div className="flex gap-1 p-2 z-10">
                {activeStatus.statuses.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded ${i <= index ? "bg-white" : "bg-gray-600"
                            }`}
                    />
                ))}
            </div>

            {/* Media */}
            <div className="relative w-full h-full max-w-full overflow-hidden flex items-center justify-center">

                {currentStatus.type === "image" ? (
                    <img
                        src={`${ENDPOINT}${currentStatus.content}`}
                        className="max-h-full max-w-full object-contain"
                    />
                ) : (
                    <video
                        src={`${ENDPOINT}${currentStatus.content}`}
                        className="max-h-full max-w-full"
                        autoPlay
                        muted
                        onEnded={goNext}
                    />
                )}

                {index > 0 && (
                    <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white"
                    >
                        <ChevronLeft size={28} />
                    </button>
                )}

                {index < activeStatus.statuses.length - 1 && (
                    <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white"
                    >
                        <ChevronRight size={28} />
                    </button>
                )}
            </div>

            {/* User Info */}
            <div className="p-3 text-white">
                <p className="font-semibold">{activeStatus.name}</p>
                <p className="text-xs opacity-70">
                    {index + 1} / {activeStatus.statuses.length}
                </p>
            </div>
        </div>
    );
};

export default StatusView;
