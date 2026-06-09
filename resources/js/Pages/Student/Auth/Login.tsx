import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function StudentLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/student/login', { onError: () => reset('password') });
    };

    return (
        <>
            <Head title="Student Login — Jamia Arabia Ahsan Ul Uloom" />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a1f14 0%, #1a3d26 50%, #0d2418 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 16, position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(46,160,92,0.08)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(46,160,92,0.05)', pointerEvents: 'none' }} />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        width: '100%', maxWidth: 440,
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20, padding: '40px 36px',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            fontSize: 48, marginBottom: 12, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                        }}>🕌</div>
                        <h1 style={{ color: 'white', fontSize: '1.375rem', fontWeight: 700, margin: '0 0 4px' }}>
                            Jamia Arabia Ahsan Ul Uloom
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: 0 }}>
                            Student Portal — جامعہ عربیہ احسن العلوم
                        </p>
                    </div>

                    {/* Welcome text */}
                    <div style={{
                        textAlign: 'center', marginBottom: 28,
                        padding: '12px 16px', borderRadius: 10,
                        background: 'rgba(46,160,92,0.12)', border: '1px solid rgba(46,160,92,0.2)',
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', margin: 0, fontStyle: 'italic' }}>
                            "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: '4px 0 0' }}>
                            Seeking knowledge is obligatory upon every Muslim.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', marginBottom: 6, fontWeight: 500 }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="student@jamia.com"
                                autoComplete="email"
                                style={{
                                    width: '100%', padding: '11px 14px',
                                    background: 'rgba(255,255,255,0.07)',
                                    border: errors.email ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.12)',
                                    borderRadius: 10, color: 'white', fontSize: '0.9375rem',
                                    outline: 'none', boxSizing: 'border-box',
                                }}
                                onFocus={e => (e.target.style.borderColor = '#2ea05c')}
                                onBlur={e => (e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.12)')}
                            />
                            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', marginBottom: 6, fontWeight: 500 }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    style={{
                                        width: '100%', padding: '11px 44px 11px 14px',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: errors.password ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.12)',
                                        borderRadius: 10, color: 'white', fontSize: '0.9375rem',
                                        outline: 'none', boxSizing: 'border-box',
                                    }}
                                    onFocus={e => (e.target.style.borderColor = '#2ea05c')}
                                    onBlur={e => (e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255,255,255,0.12)')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.4)', fontSize: 18,
                                    }}
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.password}</p>}
                        </div>

                        {/* Remember me */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                style={{ marginRight: 8, accentColor: '#2ea05c' }}
                            />
                            <label htmlFor="remember" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem', cursor: 'pointer' }}>
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={processing}
                            whileHover={{ scale: processing ? 1 : 1.01 }}
                            whileTap={{ scale: processing ? 1 : 0.98 }}
                            style={{
                                width: '100%', padding: '13px',
                                background: processing
                                    ? 'rgba(46,160,92,0.5)'
                                    : 'linear-gradient(135deg, #1e6b3e, #2ea05c)',
                                border: 'none', borderRadius: 10, cursor: processing ? 'wait' : 'pointer',
                                color: 'white', fontWeight: 700, fontSize: '0.9375rem',
                                boxShadow: processing ? 'none' : '0 4px 20px rgba(46,160,92,0.4)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {processing ? '🔄 Logging in...' : '🔑 Login to Student Portal'}
                        </motion.button>
                    </form>

                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: 24, marginBottom: 0 }}>
                        Having trouble? Contact administration at the campus.
                    </p>
                </motion.div>
            </div>
        </>
    );
}
