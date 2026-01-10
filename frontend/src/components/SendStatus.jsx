import React from 'react'

const SendStatus = ({previewUrl, fileType, addStatus}) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">

            {fileType === "image" && (
                <img
                    src={previewUrl}
                    className="max-h-[80%] rounded-lg shadow-lg"
                />
            )}

            {fileType === "video" && (
                <video
                    src={previewUrl}
                    controls
                    autoPlay
                    className="max-h-[80%] rounded-lg shadow-lg"
                />
            )}

            <button
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full"
                onClick={() => {
                    addStatus();
                }}
            >
                Post Status
            </button>

        </div>
    )
}

export default SendStatus
