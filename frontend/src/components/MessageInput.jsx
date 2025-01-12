import React, { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react"; // Import the emoji picker


const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null); // Create ref for emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for toggle picker
  const { sendMessage } = useChatStore();


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
        await sendMessage({
            text: text.trim(),
            image: imagePreview,
        });

        // Clear form
        setText("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
        console.error("Failed to send message:", error);
        }
    };

    const handleEmojiClick = (emojiData) => {
        setText(prevText => prevText + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handleEmojiButtonClick = () => {
        setShowEmojiPicker(prevShow => !prevShow);
    };

    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
      }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
       <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
               type="button"
               className={`hidden sm:flex btn btn-circle
                      ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
               onClick={() => fileInputRef.current?.click()}
            >
             <Image size={20} />
           </button>
           <button type="button" onClick={handleEmojiButtonClick} className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM16.364 18.364a9 9 0 00-1.485-1.759M16.5 21v-2.25a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75V21m3-3.375c.721-.036 1.45.092 2.16.263m-3 3.375c-.721-.036-1.45.092-2.16.263" />
                </svg>
              </button>
           </div>
           <div ref={emojiPickerRef} className="absolute bottom-16 left-0 bg-white rounded- shadow-md z-10">
                {showEmojiPicker && (
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                 )}
           </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={23} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;