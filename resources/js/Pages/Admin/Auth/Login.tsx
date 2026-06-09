import React from 'react';
import { Head } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Alert } from '@/Components/ui/Alert';
import { motion, AnimatePresence } from 'framer-motion';

// Import our custom steps
import LoginForm from './Components/LoginForm';
import OTPVerificationForm from './Components/OTPVerificationForm';
import ForgotPasswordForm from './Components/ForgotPasswordForm';
import ResetPasswordForm from './Components/ResetPasswordForm';

interface LoginProps {
    errors: Record<string, string>;
    status?: string;
    initialStep?: 'login' | 'otp_verify' | 'forgot_password';
    email?: string;
    otpSent?: boolean;
    otpVerified?: boolean;
}

export default function Login({ errors, status, initialStep = 'login', email = '', otpSent = false, otpVerified = false }: LoginProps) {
    // Determine visual headers for the steps
    let pageTitle = "Welcome Back";
    let pageSubtitle = "Sign in to Jamia Ahsan Admin Portal";

    if (initialStep === 'otp_verify') {
        pageTitle = "Security Verification";
        pageSubtitle = "Enter the 6-digit OTP code to verify your identity";
    } else if (initialStep === 'forgot_password') {
        if (otpVerified) {
            pageTitle = "Reset Password";
            pageSubtitle = "Choose a strong, secure new password";
        } else if (otpSent) {
            pageTitle = "Verify Recovery Code";
            pageSubtitle = "Enter the recovery OTP sent to your email";
        } else {
            pageTitle = "Forgot Password";
            pageSubtitle = "Recover your institutional administration account";
        }
    }

    // Determine which form to render
    const renderForm = () => {
        if (initialStep === 'otp_verify') {
            return (
                <OTPVerificationForm 
                    email={email} 
                    purpose="login" 
                    errors={errors} 
                />
            );
        }

        if (initialStep === 'forgot_password') {
            if (otpVerified) {
                return (
                    <ResetPasswordForm 
                        errors={errors} 
                    />
                );
            }
            if (otpSent) {
                return (
                    <OTPVerificationForm 
                        email={email} 
                        purpose="forgot_password" 
                        errors={errors} 
                    />
                );
            }
            return (
                <ForgotPasswordForm 
                    errors={errors} 
                />
            );
        }

        return (
            <LoginForm 
                errors={errors} 
            />
        );
    };

    // Animation configuration for sliding steps
    const stepVariants = {
        initial: { opacity: 0, x: 15 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
        exit: { opacity: 0, x: -15, transition: { duration: 0.20, ease: "easeIn" } }
    } as const;

    return (
        <AuthLayout title={pageTitle} subtitle={pageSubtitle}>
            <Head title={pageTitle} />

            {/* Display session feedback message if present */}
            {status && (
                <Alert variant="success" className="mb-6">
                    {status}
                </Alert>
            )}

            {/* Framer motion animate key helps swap forms smoothly */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${initialStep}-${otpSent}-${otpVerified}`}
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full"
                >
                    {renderForm()}
                </motion.div>
            </AnimatePresence>
        </AuthLayout>
    );
}
