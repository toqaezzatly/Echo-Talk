import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { io } from "socket.io-client";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  socket: null,
  unsubscribeMessages: null,


  initializeSocket: (userId) => {
    const socket = io(import.meta.env.VITE_REACT_APP_BASE_URL, {
      query: {
        userId: userId,
      },
      autoConnect: true, // set to false if you want to control when the connection is established
    });

    set({ socket });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },




  subscribeToMessages: () => {
    const { socket, selectedUser, setMessages } = get();

    if (!socket || !selectedUser) return;
    // Store the function that unsubscribes from the event.
    const unsubscribeFn = socket.on("newMessage", (newMessage) => {
        const isMessageRelatedToSelectedUser =
            newMessage.senderId === selectedUser._id ||
            newMessage.receiverId === selectedUser._id;
        if (!isMessageRelatedToSelectedUser) return;
        setMessages((prev) => [...prev, newMessage]);
    });


    set({ unsubscribeMessages: unsubscribeFn})
  },


  
  unsubscribeFromMessages: () => {
        const { socket, unsubscribeMessages} = get();


        if (socket && unsubscribeMessages && typeof unsubscribeMessages === 'function') {
            unsubscribeMessages();
            set({ unsubscribeMessages: null})
        }
    },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));