import React, { useState } from 'react';
import AuthImagePattern from '../components/AuthImagePattern';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { theme } = useThemeStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        
        setLoading(true);
        setMessage("");

        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            if (response.status === 200) {
                setMessage("We've sent a password reset link to your email");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col md:flex-row" data-theme={theme}>
            {/* Theme-responsive gradient section */}
            <div className="md:w-1/2 flex items-center justify-center p-8 
                bg-gradient-to-br 
                from-primary/90 to-primary/70 
                dark:from-slate-800 dark:to-slate-600
                transition-all duration-300">
                
                <AuthImagePattern 
                    title="Welcome Back!"
                    subtitle="Enter your email to reset your password and continue your conversations"
                    className="text-white dark:text-slate-100"
                />
            </div>

            {/* Form Section */}
            <div className="md:w-1/2 flex items-center justify-center p-8 
                bg-base-100 dark:bg-slate-900
                transition-colors duration-300">
                
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-base-content dark:text-slate-100">
                            Reset Password
                        </h1>
                        <p className="text-neutral dark:text-slate-400">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-base-content dark:text-slate-300 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-neutral/70 dark:text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 
                                    border border-base-300 dark:border-slate-600 
                                    bg-base-200 dark:bg-slate-800 
                                    rounded-lg 
                                    focus:ring-2 focus:ring-primary 
                                    focus:border-primary 
                                    text-base-content dark:text-slate-100
                                    placeholder:text-neutral/50 dark:placeholder:text-slate-400"
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary-focus 
                            text-primary-content 
                            font-medium py-3 px-4 rounded-lg 
                            transition-colors duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center text-sm mt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary hover:text-primary-focus font-medium"
                            >
                                ← Back to Login
                            </button>
                        </div>

                        {message && (
                            <div className="mt-4 p-3 bg-success/10 text-success-content 
                            rounded-lg border border-success/20 text-sm">
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;