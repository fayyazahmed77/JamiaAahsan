import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Calendar, Plus, Clock, MapPin, User, Trash2, Edit, Filter, RefreshCw } from 'lucide-react';

interface TimetableSlot {
    id: number;
    course_id: number;
    course_name: string;
    course_name_ur?: string;
    program_name?: string;
    semester_name?: string;
    teacher_id: number;
    teacher_name: string;
    room_id?: number | null;
    room_name?: string;
    day_of_week: number;
    start_time: string; // HH:MM
    end_time: string; // HH:MM
    is_active: boolean;
}

interface Course {
    id: number;
    name: string;
    name_ur?: string;
    program_id: number;
    semester_id?: number | null;
    teacher_id?: number | null;
    code: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface ClassRoom {
    id: number;
    name: string;
    capacity: number;
}

interface Program {
    id: number;
    name: string;
}

interface Semester {
    id: number;
    name: string;
    program_id: number;
}

interface Props {
    slots: TimetableSlot[];
    courses: Course[];
    teachers: Teacher[];
    rooms: ClassRoom[];
    programs: Program[];
    semesters: Semester[];
    filters: {
        program_id?: string;
        semester_id?: string;
        teacher_id?: string;
        room_id?: string;
    };
}

const DAYS = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' }
];

export default function TimetableIndex({ slots, courses, teachers, rooms, programs, semesters, filters }: Props) {
    const { hasPermission } = usePermission();
    const [programFilter, setProgramFilter] = useState(filters.program_id ?? '');
    const [semesterFilter, setSemesterFilter] = useState(filters.semester_id ?? '');
    const [teacherFilter, setTeacherFilter] = useState(filters.teacher_id ?? '');
    const [roomFilter, setRoomFilter] = useState(filters.room_id ?? '');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
    const [deleteSlot, setDeleteSlot] = useState<TimetableSlot | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        course_id: '',
        teacher_id: '',
        room_id: '',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '10:00',
        is_active: true,
    });

    const handleProgramFilter = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setProgramFilter(val);
        // Clear dependent semester filter if program changes
        setSemesterFilter('');
        applyFilters(val, '', teacherFilter, roomFilter);
    };

    const handleSemesterFilter = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setSemesterFilter(val);
        applyFilters(programFilter, val, teacherFilter, roomFilter);
    };

    const handleTeacherFilter = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setTeacherFilter(val);
        applyFilters(programFilter, semesterFilter, val, roomFilter);
    };

    const handleRoomFilter = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setRoomFilter(val);
        applyFilters(programFilter, semesterFilter, teacherFilter, val);
    };

    const applyFilters = (prog: string, sem: string, teach: string, rm: string) => {
        router.get(
            '/admin/timetable',
            {
                program_id: prog || undefined,
                semester_id: sem || undefined,
                teacher_id: teach || undefined,
                room_id: rm || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setProgramFilter('');
        setSemesterFilter('');
        setTeacherFilter('');
        setRoomFilter('');
        router.get('/admin/timetable');
    };

    const openAddModal = (day?: number, start?: string) => {
        reset();
        clearErrors();
        setEditingSlot(null);
        if (day) setData('day_of_week', day);
        if (start) {
            setData('start_time', start);
            const [h, m] = start.split(':').map(Number);
            const endH = h + 1;
            setData('end_time', `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
        setModalOpen(true);
    };

    const openEditModal = (slot: TimetableSlot, e: React.MouseEvent) => {
        e.stopPropagation();
        clearErrors();
        setEditingSlot(slot);
        setData({
            course_id: slot.course_id.toString(),
            teacher_id: slot.teacher_id.toString(),
            room_id: slot.room_id ? slot.room_id.toString() : '',
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_active: slot.is_active,
        });
        setModalOpen(true);
    };

    const handleCourseChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setData('course_id', val);
        const selectedCourse = courses.find(c => c.id.toString() === val);
        if (selectedCourse?.teacher_id) {
            setData(data => ({
                ...data,
                course_id: val,
                teacher_id: selectedCourse.teacher_id!.toString()
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSlot) {
            put(`/admin/timetable/${editingSlot.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/timetable', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteSlot) return;
        router.delete(`/admin/timetable/${deleteSlot.id}`, {
            onSuccess: () => setDeleteSlot(null),
        });
    };

    // Calculate grid placements (8:00 AM - 6:00 PM)
    const START_HOUR = 8;
    const END_HOUR = 18;
    const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;

    const getTimeOffsetPercent = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const minutesSinceStart = (h * 60 + m) - (START_HOUR * 60);
        return Math.min(100, Math.max(0, (minutesSinceStart / TOTAL_MINUTES) * 100));
    };

    const getTimeHeightPercent = (startStr: string, endStr: string) => {
        const [sh, sm] = startStr.split(':').map(Number);
        const [eh, em] = endStr.split(':').map(Number);
        const duration = (eh * 60 + em) - (sh * 60 + sm);
        return Math.min(100, Math.max(8, (duration / TOTAL_MINUTES) * 100));
    };

    const filteredSemesters = programFilter 
        ? semesters.filter(s => s.program_id.toString() === programFilter)
        : semesters;

    return (
        <AdminLayout
            title="Class Scheduler Timetable"
            action={
                hasPermission('create classes') ? (
                    <Button variant="primary" onClick={() => openAddModal()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Plus size={16} />
                        Schedule Class
                    </Button>
                ) : undefined
            }
        >
            <Head title="Class Scheduler & Timetable" />

            {/* Filter Toolbar */}
            <Card style={{ marginBottom: 20 }}>
                <CardBody style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>Program</div>
                            <SearchableSelect
                                value={programFilter}
                                onChange={handleProgramFilter}
                                options={programs.map(p => ({ value: p.id.toString(), label: p.name }))}
                                placeholder="All Programs"
                            />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>Semester</div>
                            <SearchableSelect
                                value={semesterFilter}
                                onChange={handleSemesterFilter}
                                options={filteredSemesters.map(s => ({ value: s.id.toString(), label: s.name }))}
                                placeholder="All Semesters"
                                disabled={!programFilter}
                            />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>Teacher</div>
                            <SearchableSelect
                                value={teacherFilter}
                                onChange={handleTeacherFilter}
                                options={teachers.map(t => ({ value: t.id.toString(), label: t.name }))}
                                placeholder="All Teachers"
                            />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>Room</div>
                            <SearchableSelect
                                value={roomFilter}
                                onChange={handleRoomFilter}
                                options={rooms.map(r => ({ value: r.id.toString(), label: `${r.name} (Cap: ${r.capacity})` }))}
                                placeholder="All Rooms"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button variant="secondary" onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <RefreshCw size={14} />
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Visual Grid Scheduler */}
            <Card style={{ overflow: 'hidden' }}>
                <CardBody style={{ padding: 0, overflowX: 'auto' }}>
                    <div style={{ minWidth: 900, display: 'flex', flexDirection: 'column', background: 'var(--surface-1)' }}>
                        {/* Days Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', fontWeight: 700, fontSize: '0.85rem' }}>
                            <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)', borderRight: '1px solid var(--border)' }}>Time</div>
                            {DAYS.map(day => (
                                <div key={day.value} style={{ padding: 12, textAlign: 'center', color: 'var(--text-primary)', borderRight: day.value < 7 ? '1px solid var(--border)' : 'none' }}>
                                    {day.label}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid Body */}
                        <div style={{ display: 'flex', position: 'relative', height: 620 }}>
                            {/* Time indicators column */}
                            <div style={{ width: 80, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--surface-2)', position: 'relative' }}>
                                {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => {
                                    const hour = START_HOUR + i;
                                    const timeLabel = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
                                    return (
                                        <div
                                            key={hour}
                                            style={{
                                                position: 'absolute',
                                                top: `${(i / (END_HOUR - START_HOUR)) * 100}%`,
                                                width: '100%',
                                                textAlign: 'center',
                                                fontSize: '0.7rem',
                                                color: 'var(--text-muted)',
                                                fontWeight: 600,
                                                transform: 'translateY(-50%)',
                                            }}
                                        >
                                            {timeLabel}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Columns for each Day */}
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', position: 'relative' }}>
                                {/* Horizontal grid line guidelines */}
                                {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: `${((i + 1) / (END_HOUR - START_HOUR)) * 100}%`,
                                            height: 1,
                                            background: 'var(--border)',
                                            opacity: 0.4,
                                            zIndex: 1,
                                        }}
                                    />
                                ))}

                                {/* Day slots columns */}
                                {DAYS.map(day => {
                                    const daySlots = slots.filter(s => s.day_of_week === day.value);
                                    return (
                                        <div
                                            key={day.value}
                                            style={{
                                                position: 'relative',
                                                height: '100%',
                                                borderRight: day.value < 7 ? '1px solid var(--border)' : 'none',
                                                zIndex: 2,
                                                background: 'transparent',
                                            }}
                                            onClick={() => openAddModal(day.value, '09:00')}
                                        >
                                            {daySlots.map(slot => {
                                                const topOffset = getTimeOffsetPercent(slot.start_time);
                                                const height = getTimeHeightPercent(slot.start_time, slot.end_time);

                                                return (
                                                    <div
                                                        key={slot.id}
                                                        onClick={(e) => openEditModal(slot, e)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: `${topOffset}%`,
                                                            height: `${height}%`,
                                                            left: 4,
                                                            right: 4,
                                                            background: slot.is_active 
                                                                ? 'linear-gradient(135deg, rgba(30,107,62,0.12) 0%, rgba(30,107,62,0.06) 100%)'
                                                                : 'rgba(100,116,139,0.1)',
                                                            border: slot.is_active 
                                                                ? '1px solid rgba(30,107,62,0.3)'
                                                                : '1px solid rgba(100,116,139,0.25)',
                                                            borderRadius: 8,
                                                            padding: '6px 8px',
                                                            overflow: 'hidden',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                                            zIndex: 10,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.02)';
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,107,62,0.15)';
                                                            e.currentTarget.style.borderColor = 'rgba(30,107,62,0.5)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'none';
                                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                                                            e.currentTarget.style.borderColor = slot.is_active ? 'rgba(30,107,62,0.3)' : 'rgba(100,116,139,0.25)';
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                {slot.course_name}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                                                                <User size={10} />
                                                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{slot.teacher_name}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                                                                <MapPin size={10} />
                                                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{slot.room_name}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.6rem', fontWeight: 700, color: '#1e6b3e' }}>
                                                                <Clock size={9} />
                                                                <span>{slot.start_time} - {slot.end_time}</span>
                                                            </div>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeleteSlot(slot);
                                                                }}
                                                                style={{
                                                                    border: 'none', background: 'transparent', cursor: 'pointer',
                                                                    padding: 2, color: 'var(--text-muted)', display: 'inline-flex', borderRadius: 4
                                                                }}
                                                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                            >
                                                                <Trash2 size={11} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Schedule Slot Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingSlot ? 'Edit Timetable Slot' : 'Schedule Timetable Slot'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingSlot ? 'Update' : 'Schedule'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <SearchableSelect
                        label="Course / Subject"
                        required
                        value={data.course_id}
                        onChange={handleCourseChange}
                        options={courses.map(c => ({ value: c.id.toString(), label: `${c.name} (${c.code})` }))}
                        error={errors.course_id}
                    />

                    <SearchableSelect
                        label="Teacher / Instructor"
                        required
                        value={data.teacher_id}
                        onChange={(e) => setData('teacher_id', e.target.value)}
                        options={teachers.map(t => ({ value: t.id.toString(), label: t.name }))}
                        error={errors.teacher_id}
                    />

                    <SearchableSelect
                        label="Classroom / Room (Optional)"
                        value={data.room_id}
                        onChange={(e) => setData('room_id', e.target.value)}
                        options={rooms.map(r => ({ value: r.id.toString(), label: `${r.name} (Cap: ${r.capacity})` }))}
                        error={errors.room_id}
                        placeholder="Select room (TBA)"
                    />

                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <SearchableSelect
                                label="Day of Week"
                                required
                                value={data.day_of_week.toString()}
                                onChange={(e) => setData('day_of_week', parseInt(e.target.value) || 1)}
                                options={DAYS.map(d => ({ value: d.value.toString(), label: d.label }))}
                                error={errors.day_of_week}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Start Time"
                                type="time"
                                required
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                error={errors.start_time}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="End Time"
                                type="time"
                                required
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                error={errors.end_time}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input 
                            type="checkbox" 
                            id="is_active" 
                            checked={data.is_active} 
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <label htmlFor="is_active" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Active Schedule Slot</label>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteSlot}
                onClose={() => setDeleteSlot(null)}
                onConfirm={handleDelete}
                title="Remove Scheduled Slot"
                message={`Are you sure you want to remove this scheduled slot for "${deleteSlot?.course_name}"?`}
                variant="danger"
            />
        </AdminLayout>
    );
}
