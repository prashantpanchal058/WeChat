import { useState, useRef, useEffect, useContext } from "react";
import avatarIcon from "../assets/avatar-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import statusContext from "../context/status/statusContext";
import StatusView from "../components/StatusView";
import SendStatus from "../components/SendStatus";
import StatusList from "../components/StatusList";
import SeemyStatus from "../components/SeemyStatus";

const StatusPage = () => {
  const { uploadStatus, mystatuses } = useContext(statusContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ================= State ================= */

  const [showMyStatus, setShowMyStatus] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);

  const [statusFile, setStatusFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  const [myStatus, setMyStatus] = useState([]);       // always array
  const [otherStatus, setOtherStatus] = useState([]); // always array

  /* ================= File Handling ================= */

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatusFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFileType(file.type.startsWith("video") ? "video" : "image");
  };

  const addStatus = async () => {
    if (!statusFile) return;

    await uploadStatus(statusFile);

    const my = await mystatuses();
    setMyStatus(Array.isArray(my) ? my : my ? [my] : []);

    setPreviewUrl(null);
    setStatusFile(null);
    setFileType(null);
  };

  /* ================= Fetch My Status ================= */

  useEffect(() => {
    const fetchMyStatus = async () => {
      const my = await mystatuses();
      setMyStatus(Array.isArray(my) ? my : my ? [my] : []);
    };

    fetchMyStatus();
  }, []);

  /* ================= Click Handlers ================= */

  const openMyStatusViewer = () => {
    setShowMyStatus(true);
    setActiveStatus(null);
  };

  const openLatestMyStatus = () => {
    if (!myStatus.length) return;
    setActiveStatus(myStatus);
    setShowMyStatus(true);
    navigate(`/maintab/status/${myStatus[0]._id}`);
  };

  const onClickOtherStatus = (statusItem) => {
    setActiveStatus(statusItem);
    setShowMyStatus(false);
    navigate(`/maintab/status/${statusItem.id}`);
  };

  /* ================= Render ================= */

  return (
    <div className="h-screen flex bg-blue-200">

      {/* ================= Sidebar ================= */}
      <aside className="w-96 bg-blue-100 border-r overflow-y-auto">

        <div className="bg-blue-300 px-6 py-4 font-semibold text-lg">
          Status
        </div>

        <div className="px-4 py-4 space-y-6">

          {/* ================= My Status ================= */}
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="relative bg-green-500 p-1 rounded-full">

              {/* Avatar → open latest status */}
              <img
                src={avatarIcon}
                className="w-14 h-14 rounded-full bg-blue-100 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  openLatestMyStatus();
                }}
              />

              {/* + → add status ONLY */}
              <span
                onClick={(e) => {
                  e.stopPropagation();   // 🔥 critical fix
                  openFilePicker();
                }}
                className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 text-white text-sm flex items-center justify-center rounded-full"
              >
                +
              </span>
            </div>

            <div onClick={openMyStatusViewer}>
              <p className="font-medium">My Status</p>
              <p className="text-sm text-gray-600">
                {myStatus.length
                  ? `${myStatus.length} update${myStatus.length > 1 ? "s" : ""}`
                  : "Tap to add status update"}
              </p>
            </div>

            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* ================= Other Status ================= */}
          <StatusList
            status={otherStatus}
            onclickbun={onClickOtherStatus}
          />

        </div>
      </aside>

      {/* ================= Viewer ================= */}
      <main className="flex-1 flex items-center justify-center bg-blue-200">
        {previewUrl ? (
          <SendStatus
            previewUrl={previewUrl}
            fileType={fileType}
            addStatus={addStatus}
          />
        ) : showMyStatus ? (
          <SeemyStatus activeStatus={myStatus} />
        ) : (
          <StatusView activeStatus={activeStatus} />
        )}
      </main>
    </div>
  );
};

export default StatusPage;
