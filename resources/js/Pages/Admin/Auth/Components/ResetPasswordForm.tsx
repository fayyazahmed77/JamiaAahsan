import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface ResetPasswordFormProps {
    errors: Record<string, string>;
}

export default function ResetPasswordForm({ errors }: ResetPasswordFormProps) {
    const { data, setData, post, processing } = useForm({
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/password/reset');
    };

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="text-center mb-2">
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Choose a secure, strong password containing at least 8 characters.
                </p>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="new-password" className="text-sm font-medium text-secondary-foreground required">
                    New Password <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none flex items-center">
                        <Lock size={16} />
                    </span>
                    <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        className="h-9 w-full min-w-0 rounded-lg border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 pl-9 pr-10 py-1.5 text-sm transition-colors outline-none focus-visible:border-primary-500 focus-visible:ring-3 focus-visible:ring-primary-500/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
                        style={{ paddingLeft: '34px', paddingRight: '40px' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer flex items-center justify-center"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="form-error text-xs text-destructive flex items-center gap-1 mt-1" role="alert">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {errors.password}
                    </p>
                )}
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="confirm-password" className="text-sm font-medium text-secondary-foreground required">
                    Confirm New Password <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none flex items-center">
                        <Lock size={16} />
                    </span>
                    <input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        className="h-9 w-full min-w-0 rounded-lg border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 pl-9 pr-10 py-1.5 text-sm transition-colors outline-none focus-visible:border-primary-500 focus-visible:ring-3 focus-visible:ring-primary-500/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
                        style={{ paddingLeft: '34px', paddingRight: '40px' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer flex items-center justify-center"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {errors.password_confirmation && (
                    <p className="form-error text-xs text-destructive flex items-center gap-1 mt-1" role="alert">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={processing}
                    className="w-full font-bold cursor-pointer"
                >
                    Update Password & Login
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
