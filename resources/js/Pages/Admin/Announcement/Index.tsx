import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import { Pin, Trash2, Edit2, Volume2, Plus, AlertCircle, Save } from 'lucide-react';

interface Creator {
    id: number;
    name: string;
}

interface Announcement {
    id: number;
    title: string;
    title_ur: string | null;
    content: string | null;
    content_ur: string | null;
    audience: 'all' | 'students' | 'teachers';
    is_pinned: boolean;
    published_at: string | null;
    creator?: Creator;
    created_at: string;
}

interface Props {
    announcements: {
        data: Announcement[];
        current_page: number;
        last_page: number;
    };
}

export default function AnnouncementIndex({ announcements }: Props) {
    const [editingItem, setEditingItem] = useState<Announcement | null>(null);
    const [showFormCard, setShowFormCard] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        title: '',
        title_ur: '',
        content: '',
        content_ur: '',
        audience: 'all' as 'all' | 'students' | 'teachers',
        is_pinned: false,
        published_at: '',
        send_notification: false,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements', {
            onSuccess: () => {
                reset();
                setShowFormCard(false);
            }
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        put(`/admin/announcements/${editingItem.id}`, {
            onSuccess: () => {
                setEditingItem(null);
                reset();
            }
        });
    };

    const startEdit = (item: Announcement) => {
        setEditingItem(item);
        setShowFormCard(false);
        setData({
            title: item.title ?? '',
            title_ur: item.title_ur ?? '',
            content: item.content ?? '',
            content_ur: item.content_ur ?? '',
            audience: item.audience,
            is_pinned: item.is_pinned,
            published_at: item.published_at ? item.published_at.substring(0, 10) : '',
            send_notification: false,
        });
    };

    const cancelEdit = () => {
        setEditingItem(null);
        reset();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            router.delete(`/admin/announcements/${id}`);
        }
    };

    return (
        <AdminLayout
            title="Notice Board & Announcements"
            breadcrumbs={[
                { label: 'CMS', href: '#' },
                { label: 'Announcements' }
            ]}
            action={
                !showFormCard && !editingItem && (
                    <Button variant="primary" onClick={() => { setShowFormCard(true); reset(); }} className="flex items-center gap-1.5">
                        <Plus size={16} /> New Announcement
                    </Button>
                )
            }
        >
            <Head title="Announcements Management" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Announcements List */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <Card>
                        <CardBody className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-stone-50/5">
                                            <th className="p-4 font-semibold text-muted-foreground">Title</th>
                                            <th className="p-4 font-semibold text-muted-foreground">Audience</th>
                                            <th className="p-4 font-semibold text-muted-foreground">Date</th>
                                            <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {announcements.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                    No announcements found. Click "New Announcement" to create one.
                                                </td>
                                            </tr>
                                        ) : (
                                            announcements.data.map((item) => (
                                                <tr key={item.id} className="border-b border-border hover:bg-stone-50/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            {item.is_pinned && <Pin size={14} className="text-primary fill-primary shrink-0" />}
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-foreground">{item.title}</span>
                                                                {item.title_ur && (
                                                                    <span className="text-xs text-muted-foreground font-urdu text-right" dir="rtl">
                                                                        {item.title_ur}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                                                            item.audience === 'all' 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : item.audience === 'students'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {item.audience}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-muted-foreground">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                onClick={() => startEdit(item)}
                                                                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-stone-50/5 border-none cursor-pointer outline-none"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 border-none cursor-pointer outline-none"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Form Card (Create / Edit) */}
                {(showFormCard || editingItem) && (
                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardBody>
                                <h3 className="font-semibold text-lg border-b pb-2 border-border mb-4" style={{ color: 'var(--text-primary)' }}>
                                    {editingItem ? 'Edit Announcement' : 'New Announcement'}
                                </h3>
                                <form onSubmit={editingItem ? handleUpdate : handleCreate} className="flex flex-col gap-4">
                                    <Input
                                        label="English Title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={errors.title}
                                        required
                                    />
                                    <Input
                                        label="Urdu Title"
                                        value={data.title_ur}
                                        onChange={(e) => setData('title_ur', e.target.value)}
                                        error={errors.title_ur}
                                        className="font-urdu text-right"
                                    />
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold">English Content</label>
                                        <textarea
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        />
                                        {errors.content && <span className="text-sm text-destructive">{errors.content}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold font-urdu">Urdu Content</label>
                                        <textarea
                                            value={data.content_ur}
                                            onChange={(e) => setData('content_ur', e.target.value)}
                                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-urdu text-right"
                                            dir="rtl"
                                        />
                                        {errors.content_ur && <span className="text-sm text-destructive">{errors.content_ur}</span>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Select
                                            label="Audience"
                                            value={data.audience}
                                            onChange={(e) => setData('audience', e.target.value as any)}
                                            options={[
                                                { value: 'all', label: 'All Users' },
                                                { value: 'students', label: 'Students' },
                                                { value: 'teachers', label: 'Teachers' },
                                            ]}
                                        />
                                        <Select
                                            label="Pin to Top"
                                            value={data.is_pinned ? '1' : '0'}
                                            onChange={(e) => setData('is_pinned', e.target.value === '1')}
                                            options={[
                                                { value: '0', label: 'No' },
                                                { value: '1', label: 'Yes' },
                                            ]}
                                        />
                                    </div>

                                    <Input
                                        type="date"
                                        label="Publish Date (Optional)"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        error={errors.published_at}
                                    />

                                    {!editingItem && (
                                        <div className="flex items-center gap-2 mt-2 bg-stone-50/5 p-3 rounded-lg border border-border">
                                            <input
                                                type="checkbox"
                                                id="send_notification"
                                                checked={data.send_notification}
                                                onChange={(e) => setData('send_notification', e.target.checked)}
                                                className="rounded border-input text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                            />
                                            <label htmlFor="send_notification" className="text-xs font-semibold cursor-pointer">
                                                Broadcast as High-Priority FCM Push Notification
                                            </label>
                                        </div>
                                    )}

                                    <div className="flex gap-2 justify-end border-t pt-4 border-border mt-2">
                                        <Button 
                                            type="button" 
                                            variant="secondary" 
                                            onClick={editingItem ? cancelEdit : () => setShowFormCard(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-1.5">
                                            <Save size={16} /> {editingItem ? 'Save Updates' : 'Publish'}
                                        </Button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
