import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Eye, EyeOff, Loader2, Lock, Mail, User, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { signup, isSigningUp, authUser, isEmailVerificationPending } = useAuthStore();
    const navigate = useNavigate();


    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password)) strength += 1;
        return strength;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
           await signup(formData);

        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error?.response?.data?.message || "Signup failed");
            return;
        }
    };

    useEffect(() => {
        if (authUser) {
            // Removed set jwt and redirecting as not needed
            // Cookies.set('jwt', generateToken()); // save JWT in cookie
            // navigate("/");
        }
    }, [authUser, navigate]);



    const getStrengthColor = (strength) => {
        switch(strength) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-red-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-orange-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-200';
        }
    };

    const getStrengthLabel = (strength) => {
        const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
        return labels[Math.min(strength, 4)];
    };


    return (
        <div className="h-screen grid lg:grid-cols-2">
            {/* Left Side - Form or Loading */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
               {isEmailVerificationPending ? (
                    <div className="w-full max-w-md space-y-8 flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-lg text-base-content/80">
                            Verifying Account... Please check your email.
                        </p>
                    </div>
                ) : (
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div
                                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
                                transition-colors"
                            >
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content/60">Start your journey with us!</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-2 w-full rounded-full transition-all ${
                                                passwordStrength > i
                                                    ? getStrengthColor(passwordStrength)
                                                    : 'bg-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    Password Strength: {getStrengthLabel(passwordStrength)}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="••••••••"
                                     value={formData.confirmPassword}
                                     onChange={handleInputChange}
                                     required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Loading...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-2">
                        <Link to="/login" className="link link-primary">
                            Already have an account?
                        </Link>
                    </div>
                </div>
                )}
            </div>

            {/* Right Side - Image/Pattern */}
            <AuthImagePattern
                title="Create an account"
                subtitle="Start your journey with us!"
            />
        </div>
    );
};

export default SignupPage;