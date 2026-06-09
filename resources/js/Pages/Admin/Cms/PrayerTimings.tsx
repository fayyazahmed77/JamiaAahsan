import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Modal } from '@/Components/ui/Modal';
import type { PrayerTiming } from '@/types/models';
import { Clock, Edit2 } from 'lucide-react';

interface Props {
    timings: PrayerTiming[];
}

export default function PrayerTimingsIndex({ timings }: Props) {
    const [editingTiming, setEditingTiming] = useState<PrayerTiming | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { hasPermission } = usePermission();

    const { data, setData, put, processing, errors, reset } = useForm({
        time: '',
        urdu_name: '',
    });

    const openEditModal = (timing: PrayerTiming) => {
        setEditingTiming(timing);
        // Format time from HH:MM:SS to HH:MM if necessary
        const timeVal = timing.time.substring(0, 5);
        setData({
            time: timeVal,
            urdu_name: timing.urdu_name ?? '',
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTiming) return;

        put(`/admin/cms/prayer-timings/${editingTiming.id}`, {
            onSuccess: () => {
                setModalOpen(false);
                reset();
                setEditingTiming(null);
            },
        });
    };

    return (
        <AdminLayout title="Salah (Prayer) Timings">
            <Head title="Prayer Timings" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                {timings.map((pt) => (
                    <Card key={pt.id} className="relative overflow-hidden group">
                        {/* Decorative background icon */}
                        <div className="absolute -right-6 -bottom-6 text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">
                            <Clock size={120} />
                        </div>

                        <CardBody className="p-5 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{pt.name}</h3>
                                    {pt.urdu_name && (
                                        <span className="font-urdu text-primary font-semibold text-lg">{pt.urdu_name}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-2xl font-mono font-bold text-stone-700 dark:text-stone-300 mt-4 mb-6">
                                    <Clock size={20} className="text-muted-foreground" />
                                    <span>
                                        {(() => {
                                            const parts = pt.time.split(':');
                                            const hours = parseInt(parts[0]);
                                            const minutes = parts[1];
                                            const ampm = hours >= 12 ? 'PM' : 'AM';
                                            const displayHours = hours % 12 || 12;
                                            return `${displayHours}:${minutes} ${ampm}`;
                                        })()}
                                    </span>
                                </div>
                            </div>

                            {hasPermission('edit prayer-timings') && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => openEditModal(pt)}
                                    className="w-full flex items-center justify-center gap-1.5"
                                >
                                    <Edit2 size={14} /> Adjust Time
                                </Button>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Adjust Salah Time: ${editingTiming?.name}`}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            Save Changes
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="time"
                        label="Salah/Azaan Time"
                        required
                        value={data.time}
                        onChange={(e) => setData('time', e.target.value)}
                        error={errors.time}
                    />
                    <Input
                        label="Urdu Label"
                        value={data.urdu_name}
                        onChange={(e) => setData('urdu_name', e.target.value)}
                        error={errors.urdu_name}
                        className="font-urdu text-right"
                    />
                </form>
            </Modal>
        </AdminLayout>
    );
}
