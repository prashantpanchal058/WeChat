import React from "react";
import avatarIcon from "../assets/avatar-svgrepo-com.svg";

const Status = ({ status, onClick }) => {
    return (
        <div
            onClick={() => onClick(status)}
            className="flex items-center gap-4 py-2 cursor-pointer hover:bg-blue-200 rounded-lg px-4 my-1"
        >
            <div className="rounded-full bg-green-500 p-1">
                <img
                    src={avatarIcon}
                    alt={status.name}
                    className="w-12 h-12 rounded-full bg-blue-100 p-2"
                />
            </div>

            <div>
                <p className="font-medium">{status.name}</p>
                <p className="text-sm text-gray-600">{status.time}</p>
            </div>
        </div>
    );
};

export default Status;
