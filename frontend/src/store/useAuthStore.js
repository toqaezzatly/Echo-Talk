import { create } from 'zustand';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';

const BASE_URL = "http://localhost:4000";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    jwt: Cookies.get('jwt') || null,   //Initialize jwt from Cookies
    isEmailVerificationPending: false,  // Add new state
    setJwt: (token) => {                // New setJwt function
        set({ jwt: token });            // Updates the store
        Cookies.set('jwt', token, { expires: 7 });  // Updates the Cookie
    },

    checkAuth: async () => {
        console.log("checkAuth called");
        try {
            const response = await axiosInstance.get('/auth/check');
            console.log("Auth Check Response:", response.data);
            set({ authUser: response.data });
            get().connectSocket();
        } catch (error) {
            console.error("Auth Check Error:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    // useAuthStore.js
initializeAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

    signup: async (data) => {
        set({ isSigningUp: true });
        set({isEmailVerificationPending: true}); //Set email verification to true
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            // We do not want to set authUser yet, as it is not confirmed
            //set({ authUser: res.data });
            toast.success('Check your email to verify your account');
             //get().setJwt(Cookies.get("jwt")) //Set the JWT cookie from signup
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false, isEmailVerificationPending: false }); // Set email verification back to false
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            get().setJwt(Cookies.get("jwt")) //Set the JWT cookie from login
            toast.success('Logged in successfully');

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const { authUser, socket } = get();

            if (authUser && socket && socket.connected) {
                socket.emit("user-offline", authUser._id); // Emit event with userId
            }
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            //Cookies.remove('jwt'); // Remove the cookie on logout
            toast.success('Logged out successfully');
            get().disconnectSocket();
        } catch (error) {
            toast.error('Error logging out');
            toast.error(error.response.data.message);
        }
    },


    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            //const jwt = Cookies.get("jwt"); //No Longer needed
            console.log("Data being sent to updateProfile endpoint: ", data)
            // const response = await axiosInstance.put('/auth/update-profile', data, { headers: { Authorization: `Bearer ${jwt}` } }); //OLD
            const response = await axiosInstance.put('/auth/update-profile', data);
            console.log("Full response from updateProfile: ", response)
            console.log("Response Data:", response.data);
            set({ authUser: response.data });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log("Error updating profile:", error);
            console.log("Full error response:", error.response)
            toast.error(error.response.data?.message || "Error updating profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: async () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, { query: { userId: authUser._id } }); // Attach userId on connection
        socket.connect();
        set({ socket: socket });


        socket.on("getOnlineUsers", (onlineUsers) => {
            console.log("Online Users: ", onlineUsers)
            set({ onlineUsers });

        })
    },

    disconnectSocket: async () => {
        const { socket } = get();
        if (socket && socket.connected) {
            socket.disconnect();  // Correct disconnect method
            set({ socket: null });
        }
    },
    // New function to get a new access token
    getNewAccessToken: async () => {
        try {
            const authUser = get().authUser;
            if (!authUser) {
                console.error("No authUser found, cannot refresh token");
                return null;
            }
            const response = await axiosInstance.post('/auth/refresh-token', { userId: authUser._id });
            if (response.data.accessToken) {
                get().setJwt(response.data.accessToken); // Updated Line
                return response.data.accessToken;
            } else {
                console.error("Failed to refresh access token");
                return null;
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    },
}));