import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Input } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
    errors: Record<string, string>;
}

export default function ForgotPasswordForm({ errors }: ForgotPasswordFormProps) {
    const { data, setData, post, processing } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="text-center mb-2">
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Enter the email address registered with your account, and we will send you a 6-digit OTP code to verify your identity.
                </p>
            </div>

            {/* Email Field */}
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

            {/* Actions */}
            <div className="space-y-3 pt-2">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={processing}
                    className="w-full font-bold cursor-pointer"
                >
                    Send Verification Code
                </Button>

                <Link
                    href="/login"
                    className="w-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 py-2"
                >
                    <ArrowLeft size={14} />
                    Back to Login
                </Link>
            </div>
        </form>
    );
}
