import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import AuthImagePattern from '../components/AuthImagePattern';
import { useThemeStore } from '../store/useThemeStore';

const VerificationPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [verificationMessage, setVerificationMessage] = useState('');
    const navigate = useNavigate();
    const { theme } = useThemeStore();

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setVerificationMessage("Invalid verification link.");
                toast.error("Invalid verification link.");
                return;
            }

            try {
                const res = await axiosInstance.post('/auth/verify-email', { code: token });
                if (res.status === 200) {
                    setVerificationMessage("Email verified successfully!");
                    toast.success("Email verified successfully!");
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setVerificationMessage(res.data.message || "Verification failed.");
                    toast.error(res.data.message || "Verification failed.");
                }
            } catch (error) {
                console.error("Error verifying email:", error);
                const message = error.response?.data?.message || "Verification failed.";
                setVerificationMessage(message);
                toast.error(message);
            }
        };

        verifyEmail();
    }, [navigate, token]);

    return (
        <div className="flex min-h-screen flex-col md:flex-row" data-theme={theme}>
            {/* Gradient Section */}
            <div className="md:w-1/2 flex items-center justify-center p-8 
                bg-gradient-to-br 
                from-primary/90 to-primary/70 
                dark:from-slate-800 dark:to-slate-600
                transition-all duration-300">
                
                <AuthImagePattern 
                    title="Account Verification"
                    subtitle="We're verifying your email address"
                    className="text-white dark:text-slate-100"
                />
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 flex items-center justify-center p-8 
                bg-base-100 dark:bg-slate-900
                transition-colors duration-300">
                
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-base-content dark:text-slate-100">
                            Email Verification
                        </h1>
                        
                        <div className={`p-6 rounded-lg ${
                            verificationMessage.includes('success') ? 
                            'bg-success/10 text-success-content border-success/20' :
                            'bg-error/10 text-error-content border-error/20'
                        } border`}>
                            <p className="text-lg font-medium">
                                {verificationMessage}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-primary w-full mt-6"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;