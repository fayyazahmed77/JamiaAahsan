import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import { Badge } from '@/Components/ui/Badge';
import type { AppNotification, Role, User } from '@/types/models';
import { Bell, Send, Users, Shield, Clock } from 'lucide-react';

interface Props {
    notifications: {
        data: AppNotification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    roles: Role[];
    users: User[];
}

export default function NotificationsIndex({ notifications, roles, users }: Props) {
    const { hasPermission } = usePermission();
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        target: 'all' as 'all' | 'role' | 'users',
        role_name: '',
        user_ids: [] as number[],
    });

    const handleUserToggle = (id: number) => {
        const checked = data.user_ids.includes(id);
        if (checked) {
            setData('user_ids', data.user_ids.filter(uid => uid !== id));
        } else {
            setData('user_ids', [...data.user_ids, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/notifications/broadcast', {
            onSuccess: () => {
                reset('title', 'body', 'user_ids', 'role_name');
            }
        });
    };

    return (
        <AdminLayout title="Push Notifications Broadcast Center">
            <Head title="Notifications Center" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Broadcast Form (Left 2 cols) */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="border-b border-border pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Bell size={20} className="text-primary" /> Create Push Broadcast
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="py-4">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Title */}
                                <Input
                                    label="Notification Title"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                    placeholder="E.g., Shab-e-Jummah Bayan Starting Soon"
                                />

                                {/* Body */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        Notification Body Message
                                    </label>
                                    <textarea
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="Type the message body that will display on student/user mobile lockscreens..."
                                        required
                                    />
                                    {errors.body && <span className="text-sm text-destructive">{errors.body}</span>}
                                </div>

                                {/* Target Audience */}
                                <Select
                                    label="Target Audience"
                                    value={data.target}
                                    onChange={(e) => setData('target', e.target.value as any)}
                                    options={[
                                        { value: 'all', label: 'Broadcast to All Registered Users' },
                                        { value: 'role', label: 'Broadcast to Specific Security Role' },
                                        { value: 'users', label: 'Broadcast to Selected Users' },
                                    ]}
                                    error={errors.target}
                                />

                                {/* Target Conditional Inputs */}
                                {data.target === 'role' && (
                                    <Select
                                        label="Select Target Role"
                                        required
                                        value={data.role_name}
                                        onChange={(e) => setData('role_name', e.target.value)}
                                        options={[
                                            { value: '', label: 'Select a role...' },
                                            ...roles.map(r => ({ value: r.name, label: r.name }))
                                        ]}
                                        error={errors.role_name}
                                    />
                                )}

                                {data.target === 'users' && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Select Target Users</label>
                                        <div className="max-h-[180px] overflow-y-auto border rounded-md p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-stone-50/5">
                                            {users.map((u) => (
                                                <label key={u.id} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.user_ids.includes(u.id)}
                                                        onChange={() => handleUserToggle(u.id)}
                                                        className="rounded border-gray-300 text-primary h-3.5 w-3.5"
                                                    />
                                                    <span className="truncate">{u.name} ({u.email})</span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.user_ids && <span className="text-sm text-destructive">{errors.user_ids}</span>}
                                    </div>
                                )}

                                {/* Submit button */}
                                {hasPermission('create notifications') && (
                                    <div className="flex justify-end border-t pt-4 border-border">
                                        <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-1.5 w-full sm:w-auto">
                                            <Send size={16} /> Broadcast Push Alert
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </CardBody>
                    </Card>
                </div>

                {/* History Timeline Panel (Right 1 col) */}
                <div>
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock size={18} /> History Logs
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="max-h-[500px] overflow-y-auto flex flex-col gap-4">
                            {notifications.data.length === 0 ? (
                                <div className="text-center text-xs text-muted-foreground py-8">
                                    No broadcast logs found.
                                </div>
                            ) : (
                                <div className="relative border-l border-border ml-2 pl-4 flex flex-col gap-6">
                                    {notifications.data.map((n) => (
                                        <div key={n.id} className="relative">
                                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                                            <div className="flex flex-col">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-primary truncate max-w-[120px]">{n.title}</span>
                                                    <Badge variant="secondary" className="text-[9px] px-1 py-0 scale-90">
                                                        {n.user?.name || 'System'}
                                                    </Badge>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{new Date(n.created_at || '').toLocaleDateString()}</span>
                                                <p className="text-xs mt-1 text-muted-foreground line-clamp-3">{n.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
