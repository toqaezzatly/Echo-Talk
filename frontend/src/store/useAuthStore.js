import { create } from 'zustand';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    console.log("checkAuth called");
    try {
      const response = await axiosInstance.get('/api/auth/check');
      console.log("Auth Check Response:", response.data);
      set({ authUser: response.data });
    } catch (error) {
      console.error("Auth Check Error:", error);
      set({ authUser: null });
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
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
      set({isLoggingIn: true})
   try{ const res = await axiosInstance.post('/api/auth/login', data);
    set({ authUser: res.data });
    toast.success('Logged in successfully');
} catch (error) {
    toast.error(error.response.data.message);

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

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
       const response = await axiosInstance.put('/api/auth/update-profile', data);
       set({ authUser: response.data});
         toast.success('Profile updated successfully');
    } catch (error) {
        console.log("Error updating profile", error);
        toast.error(error.response.data.message);
     } finally {
        set({ isUpdatingProfile: false });
      }
   },
}));