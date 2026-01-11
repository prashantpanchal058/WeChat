const Message = ({ text, type, image, createdAt }) => {

    const ENDPOINT = import.meta.env.VITE_ENDPOINT || "https://wechat-jnge.onrender.com";
    const isSent = type === "sent";

    const isLocalImage = image?.startsWith("blob:");
    const isRemoteImage = image?.startsWith("http");

    const imageSrc = image
        ? isLocalImage || isRemoteImage
            ? image
            : `https://wechat-jnge.onrender.com${image}`
        : null;

    const formatTime = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-2 rounded-lg ${
                    isSent
                        ? "bg-blue-600 text-white me-10"
                        : "bg-white text-gray-800 ms-10"
                }`}
            >
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt="message"
                        className="
                            max-w-[70vw]
                            sm:max-w-[320px]
                            md:max-w-120
                            lg:max-w-120
                            max-h-[70vh]
                            h-auto
                            w-auto
                            rounded-xl
                            mb-2
                            object-contain
                        "
                    />
                )}

                {text && (
                    <div className="font-medium leading-snug">
                        {text}
                    </div>
                )}

                <div
                    className={`text-[12px] mt-1 text-right ${
                        isSent ? "text-blue-200" : "text-gray-400"
                    }`}
                >
                    {formatTime(createdAt)}
                </div>
            </div>
        </div>
    );
};

export default Message;
