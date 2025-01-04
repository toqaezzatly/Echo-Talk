import { create } from 'zustand';
import axiosInstance from '../lib/axios.js'; // Make sure the path is correct
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/check'); // Make sure this matches the backend route

      // Assuming response.data contains the authenticated user
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error checking auth", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/api/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Signed up successfully');
    } catch (error) {
      toast.error(error.response.data.message); // Fixed typo here
    } finally {
      set({ isSigningUp: false });
    }
  },


  login: async (data) => {

   try{ const res = await axiosInstance.post('/api/auth/login', data);

    set({ authUser: res.data });
    toast.success('Logged in successfully');
} catch (error) {
    toast.success("Logged in successfully");

} finally{
    set({isLoggingIn: false});
}


  },


  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      toast.error(error.response.data.message);
    }
  },



}));
