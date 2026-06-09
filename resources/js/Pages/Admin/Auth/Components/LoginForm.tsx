import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Input } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
    errors: Record<string, string>;
}

export default function LoginForm({ errors }: LoginFormProps) {
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            {/* Email field */}
            <Input
                id="email"
                type="email"
                label="Email Address"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                placeholder="admin@jamiaahsan.com"
                autoComplete="email"
                autoFocus
                required
                className="w-full"
                icon={<Mail size={16} />}
            />

            {/* Password field */}
            <div className="flex flex-col gap-1.5 w-full">
                <div className="flex justify-between items-center">
                    <label htmlFor="password-field" className="text-sm font-medium text-secondary-foreground required">
                        Password <span className="text-destructive ml-1">*</span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none flex items-center">
                        <Lock size={16} />
                    </span>
                    <input
                        id="password-field"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
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

            {/* Remember Me */}
            <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="rounded border-stone-300 dark:border-stone-800 text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
                    />
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
                        Remember me for 30 days
                    </span>
                </label>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={processing}
                className="w-full mt-2 font-bold cursor-pointer"
            >
                Sign In to Portal
            </Button>
        </form>
    );
}
