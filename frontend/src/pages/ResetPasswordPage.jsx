import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';
import { useThemeStore } from '../store/useThemeStore';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { theme } = useThemeStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            if (!token) {
                toast.error('Invalid reset link');
                navigate('/forgot-password');
                return;
            }
            if (token) {
                await axiosInstance.post('/auth/reset-password', { password, token });
                toast.success('Password reset successfully! Please login with your new password');
                navigate('/login');
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            toast.error(error?.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col md:flex-row" data-theme={theme}>
            {/* Gradient Section */}
            <div className="md:w-1/2 flex items-center justify-center p-8 
                bg-gradient-to-br 
                from-primary/90 to-primary/70 
                dark:from-slate-800 dark:to-slate-600
                transition-all duration-300">
                
                <AuthImagePattern 
                    title="Secure Your Account"
                    subtitle="Create a new password to protect your conversations"
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
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-base-content dark:text-slate-300 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-neutral/70 dark:text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 
                                    border border-base-300 dark:border-slate-600 
                                    bg-base-200 dark:bg-slate-800 
                                    rounded-lg 
                                    focus:ring-2 focus:ring-primary 
                                    focus:border-primary 
                                    text-base-content dark:text-slate-100
                                    placeholder:text-neutral/50 dark:placeholder:text-slate-400"
                                    placeholder="Enter new password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-neutral/70 dark:text-slate-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-neutral/70 dark:text-slate-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-base-content dark:text-slate-300 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-neutral/70 dark:text-slate-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 
                                    border border-base-300 dark:border-slate-600 
                                    bg-base-200 dark:bg-slate-800 
                                    rounded-lg 
                                    focus:ring-2 focus:ring-primary 
                                    focus:border-primary 
                                    text-base-content dark:text-slate-100
                                    placeholder:text-neutral/50 dark:placeholder:text-slate-400"
                                    placeholder="Confirm new password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-neutral/70 dark:text-slate-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-neutral/70 dark:text-slate-400" />
                                    )}
                                </button>
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
                            {loading ? 'Updating Password...' : 'Reset Password'}
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;