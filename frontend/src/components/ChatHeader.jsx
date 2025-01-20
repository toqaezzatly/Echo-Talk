import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";

const ChatHeader = ({ onProfileClick }) => {
  const { selectedUser, clearSelectedUser } = useChatStore();

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        {selectedUser ? (
          <div className="flex items-center gap-4">
            <div className="avatar cursor-pointer" onClick={() => onProfileClick(selectedUser)}>
              <div className="size-10 rounded-full border">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            </div>
            <span className="font-medium">{selectedUser?.fullName}</span>
          </div>
        ) : (
          <span>Please Select a User to chat</span>
        )}
      </div>
      <div className="flex-none">
        {selectedUser && (
          <button className="btn btn-ghost btn-circle" onClick={clearSelectedUser}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;