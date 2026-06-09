import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface OTPVerificationFormProps {
    email: string;
    purpose: 'login' | 'forgot_password';
    errors: Record<string, string>;
}

export default function OTPVerificationForm({ email, purpose, errors }: OTPVerificationFormProps) {
    const { data, setData, post, processing } = useForm({
        otp: '',
    });

    const [otpValues, setOtpValues] = React.useState<string[]>(Array(6).fill(''));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Countdown Cooldown timer (60s)
    const [cooldown, setCooldown] = React.useState(60);

    React.useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // Focus first element on mount
    React.useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Sync input array with form state
    const updateOtpState = (newValues: string[]) => {
        setOtpValues(newValues);
        setData('otp', newValues.join(''));
    };

    const handleChange = (index: number, val: string) => {
        // Only allow numbers
        const cleanVal = val.replace(/[^0-9]/g, '');
        if (!cleanVal) {
            const newValues = [...otpValues];
            newValues[index] = '';
            updateOtpState(newValues);
            return;
        }

        const digit = cleanVal.slice(-1); // take last digit if they typed fast
        const newValues = [...otpValues];
        newValues[index] = digit;
        updateOtpState(newValues);

        // Advance to next input
        if (index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otpValues[index] && index > 0 && inputRefs.current[index - 1]) {
                const newValues = [...otpValues];
                newValues[index - 1] = '';
                updateOtpState(newValues);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newValues = [...otpValues];
                newValues[index] = '';
                updateOtpState(newValues);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (text.length === 0) return;

        const newValues = [...otpValues];
        for (let i = 0; i < 6; i++) {
            newValues[i] = text[i] ?? '';
        }
        updateOtpState(newValues);

        // Focus the appropriate input
        const focusIndex = Math.min(text.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleResend = (e: React.MouseEvent) => {
        e.preventDefault();
        if (cooldown > 0) return;

        setCooldown(60);

        if (purpose === 'login') {
            router.post('/login/otp/resend');
        } else {
            router.post('/forgot-password', { email });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (purpose === 'login') {
            post('/login/otp');
        } else {
            post('/forgot-password/verify');
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                    We sent a 6-digit security code to:
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                    {email}
                </p>
            </div>

            {/* OTP Digit Blocks */}
            <div className="flex justify-between gap-2 max-w-xs mx-auto" dir="ltr">
                {otpValues.map((val, idx) => (
                    <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-xl font-bold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm focus:border-primary-500 focus:ring-3 focus:ring-primary-500/15 transition-all outline-none"
                    />
                ))}
            </div>

            {errors.otp && (
                <p className="form-error text-xs text-destructive flex items-center justify-center gap-1 mt-1" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.otp}
                </p>
            )}

            {/* Resend Cooldown Section */}
            <div className="text-center text-xs">
                {cooldown > 0 ? (
                    <span className="text-[var(--text-muted)] font-medium">
                        Resend verification code in <strong className="text-amber-500">{cooldown}s</strong>
                    </span>
                ) : (
                    <button
                        onClick={handleResend}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold flex items-center gap-1.5 justify-center mx-auto cursor-pointer"
                    >
                        <RefreshCw size={12} />
                        Resend Security Code
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={processing}
                    disabled={data.otp.length !== 6}
                    className="w-full font-bold cursor-pointer"
                >
                    Verify & Continue
                </Button>

                <button
                    type="button"
                    onClick={() => router.get('/login')}
                    className="w-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 py-2 cursor-pointer"
                >
                    <ArrowLeft size={14} />
                    Back to Login
                </button>
            </div>
        </form>
    );
}
