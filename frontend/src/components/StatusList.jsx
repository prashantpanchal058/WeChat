import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Status from "./Status";
import statusContext from "../context/status/statusContext";

const StatusList = ({ onclickbun }) => {
    const { statusGet } = useContext(statusContext);
    const { id } = useParams();

    const [recentStatuses, setRecentStatuses] = useState([]);
    const [viewedStatuses, setViewedStatuses] = useState([]);

    useEffect(() => {
        const fetchAllStatus = async () => {
            try {
                const data = await statusGet();

                const userMap = {};

                // 1️⃣ Group statuses by user
                data.forEach((status) => {
                    const userId = status.user._id;

                    if (!userMap[userId]) {
                        userMap[userId] = {
                            user: status.user,
                            statuses: [],
                        };
                    }

                    userMap[userId].statuses.push(status);
                });

                const recent = [];
                const viewed = [];

                // 2️⃣ Separate recent & viewed
                Object.values(userMap).forEach((item) => {
                    const hasUnseen = item.statuses.some(
                        (s) => !s.seenBy || s.seenBy.length === 0
                    );

                    const lastStatusTime =
                        item.statuses[item.statuses.length - 1].createdAt;

                    const statusObj = {
                        id: item.user._id,
                        name: item.user.name,
                        time: new Date(lastStatusTime).toLocaleString(),
                        statuses: item.statuses,
                    };

                    if (hasUnseen) {
                        recent.push(statusObj);
                    } else {
                        viewed.push(statusObj);
                    }
                });

                setRecentStatuses(recent);
                setViewedStatuses(viewed);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAllStatus();
    }, [statusGet]);

    return (
        <div>
            {/* Recent */}
            <div>
                <p className="text-sm text-gray-700 mb-3">Recent updates</p>
                {(!recentStatuses || recentStatuses.length === 0) && (
                    <div className="text-sm text-gray-700 ms-3">No recent status available</div>
                )}

                {recentStatuses.map((status) => (
                    <div
                        key={status.id}
                        className={status.id === id ? "bg-blue-200 rounded-lg" : ""}
                    >
                        <Status status={status} onClick={onclickbun} />
                    </div>
                ))}
            </div>

            {/* Viewed */}
            <div className="mt-4">
                <p className="text-sm text-gray-700 mb-3">Viewed updates</p>
                {viewedStatuses.map((status) => (
                    <div
                        key={status.id}
                        className={status.id === id ? "bg-blue-200 rounded-lg" : ""}
                    >
                        <Status status={status} onClick={onclickbun} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusList;
