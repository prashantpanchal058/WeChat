const Setting = () => {
    return (
        <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>

                <button
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={() => {
                        // later: clear token / context / redux
                        console.log("Logout clicked");
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Setting;
