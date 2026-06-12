import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import type { PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';

interface Program {
    id: number;
    name: string;
}

interface Semester {
    id: number;
    program_id: number;
    name: string;
    code: string;
}

interface Teacher {
    id: number;
    name: string;
    urdu_name: string;
}

interface Book {
    id: number;
    name: string;
    urdu_name: string;
}

interface StudyResource {
    id: number;
    title: string;
    description?: string;
    file_path: string;
    file_type: string;
    is_published: boolean;
}

interface Assignment {
    id: number;
    title: string;
    title_ur?: string;
    description: string;
    description_ur?: string;
    due_date: string;
    max_marks: number;
    allow_late_submission: boolean;
    is_published: boolean;
}

interface Course {
    id: number;
    program_id: number;
    semester_id: number;
    program?: Program;
    semester?: Semester;
    teacher_id?: number;
    teacher?: Teacher;
    name: string;
    name_ur?: string;
    code: string;
    credit_hours: number;
    description?: string;
    description_ur?: string;
    is_active: boolean;
    books?: Book[];
    study_resources?: StudyResource[];
    assignments?: Assignment[];
}

interface Props {
    courses: {
        data: Course[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    programs: Program[];
    semesters: Semester[];
    teachers: Teacher[];
    books: Book[];
    filters: {
        search?: string;
        program_id?: string;
        semester_id?: string;
    };
}

export default function CourseIndex({ courses, programs, semesters, teachers, books, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [programFilter, setProgramFilter] = useState(filters.program_id ?? '');
    const [semesterFilter, setSemesterFilter] = useState(filters.semester_id ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
    
    // Content desk drawer states
    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [selectedCourseForContent, setSelectedCourseForContent] = useState<Course | null>(null);
    const [activeContentTab, setActiveContentTab] = useState<'resources' | 'assignments'>('resources');

    const { hasPermission } = usePermission();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        program_id: '',
        semester_id: '',
        name: '',
        name_ur: '',
        code: '',
        credit_hours: 3,
        teacher_id: '',
        description: '',
        description_ur: '',
        is_active: true,
        book_ids: [] as number[],
    });

    const resourceForm = useForm({
        title: '',
        description: '',
        file: null as File | null,
        is_published: true,
    });

    const assignmentForm = useForm({
        title: '',
        title_ur: '',
        description: '',
        description_ur: '',
        due_date: '',
        max_marks: 10,
        allow_late_submission: true,
        is_published: true,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleProgramFilterChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setProgramFilter(val);
        applyFilters(search, val, semesterFilter);
    };

    const handleSemesterFilterChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setSemesterFilter(val);
        applyFilters(search, programFilter, val);
    };

    const applyFilters = (searchText: string, progId: string, semId: string) => {
        router.get(
            '/admin/courses',
            {
                search: searchText || undefined,
                program_id: progId || undefined,
                semester_id: semId || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, programFilter, semesterFilter);
    };

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingCourse(null);
        setModalOpen(true);
    };

    const openEditModal = (course: Course) => {
        clearErrors();
        setEditingCourse(course);
        setData({
            program_id: course.program_id.toString(),
            semester_id: course.semester_id.toString(),
            name: course.name,
            name_ur: course.name_ur ?? '',
            code: course.code,
            credit_hours: course.credit_hours,
            teacher_id: course.teacher_id ? course.teacher_id.toString() : '',
            description: course.description ?? '',
            description_ur: course.description_ur ?? '',
            is_active: course.is_active,
            book_ids: course.books ? course.books.map(b => b.id) : [],
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            put(`/admin/courses/${editingCourse.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/courses', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteCourse) return;
        router.delete(`/admin/courses/${deleteCourse.id}`, {
            onSuccess: () => setDeleteCourse(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/courses',
            {
                page,
                search: search || undefined,
                program_id: programFilter || undefined,
                semester_id: semesterFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const handleBookToggle = (bookId: number) => {
        const currentIds = [...data.book_ids];
        const idx = currentIds.indexOf(bookId);
        if (idx > -1) {
            currentIds.splice(idx, 1);
        } else {
            currentIds.push(bookId);
        }
        setData('book_ids', currentIds);
    };

    const openContentModal = (course: Course) => {
        setSelectedCourseForContent(course);
        setActiveContentTab('resources');
        resourceForm.reset();
        assignmentForm.reset();
        setContentModalOpen(true);
    };

    const handleResourceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseForContent) return;
        resourceForm.post(`/admin/courses/${selectedCourseForContent.id}/resources`, {
            forceFormData: true,
            onSuccess: () => {
                resourceForm.reset();
            }
        });
    };

    const handleAssignmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseForContent) return;
        assignmentForm.post(`/admin/courses/${selectedCourseForContent.id}/assignments`, {
            onSuccess: () => {
                assignmentForm.reset();
            }
        });
    };

    const deleteResource = (id: number) => {
        router.delete(`/admin/courses/resources/${id}`, {
            preserveScroll: true
        });
    };

    const deleteAssignment = (id: number) => {
        router.delete(`/admin/courses/assignments/${id}`, {
            preserveScroll: true
        });
    };

    const currentCourse = selectedCourseForContent 
        ? courses.data.find(c => c.id === selectedCourseForContent.id) || selectedCourseForContent
        : null;

    // Filter semesters depending on the selected program in the form
    const filteredSemesters = data.program_id
        ? semesters.filter(s => s.program_id.toString() === data.program_id)
        : [];

    const columns: ColumnDef<Course>[] = [
        {
            accessorKey: 'code',
            header: 'Code',
            size: 100,
            cell: ({ row }) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.original.code}</span>
        },
        {
            accessorKey: 'name',
            header: 'Course Name',
            cell: ({ row }) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {row.original.name}
                    </div>
                    {row.original.name_ur && (
                        <div style={{ fontSize: '0.85em', color: 'var(--text-subtle)', fontFamily: 'Noto Nastaliq Urdu, system-ui' }}>
                            {row.original.name_ur}
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'program.name',
            header: 'Program / Semester',
            cell: ({ row }) => (
                <div>
                    <div style={{ fontSize: '0.9em', fontWeight: 500 }}>{row.original.program?.name}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-subtle)' }}>{row.original.semester?.name}</div>
                </div>
            ),
        },
        {
            accessorKey: 'credit_hours',
            header: 'Credits',
            size: 80,
        },
        {
            accessorKey: 'teacher.name',
            header: 'Teacher',
            cell: ({ row }) => (
                <div>
                    <div style={{ fontSize: '0.9em' }}>{row.original.teacher?.name ?? <span style={{ color: 'var(--text-subtle)' }}>Not Assigned</span>}</div>
                    {row.original.teacher?.urdu_name && (
                        <div style={{ fontSize: '0.8em', color: 'var(--text-subtle)', fontFamily: 'Noto Nastaliq Urdu, system-ui' }}>
                            {row.original.teacher.urdu_name}
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'books',
            header: 'Textbooks / Books',
            cell: ({ row }) => {
                const courseBooks = row.original.books ?? [];
                if (courseBooks.length === 0) return <span style={{ color: 'var(--text-subtle)' }}>No books</span>;
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {courseBooks.map(b => (
                            <Badge key={b.id} variant="secondary">
                                {b.name}
                            </Badge>
                        ))}
                    </div>
                );
            }
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? 'success' : 'muted'}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
            size: 100,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    {hasPermission('edit classes') && (
                        <Button variant="secondary" size="sm" onClick={() => openContentModal(row.original)}>
                            Manage Content
                        </Button>
                    )}
                    {hasPermission('edit classes') && (
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(row.original)}>
                            Edit
                        </Button>
                    )}
                    {hasPermission('delete classes') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteCourse(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 280,
        },
    ];

    const meta: PageMeta = {
        current_page: courses.current_page,
        last_page: courses.last_page,
        per_page: courses.per_page,
        total: courses.total,
        from: courses.from,
        to: courses.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search courses by name or code..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div style={{ width: 180 }}>
                <SearchableSelect
                    value={programFilter}
                    onChange={handleProgramFilterChange}
                    options={programs.map(p => ({ value: p.id.toString(), label: p.name }))}
                    placeholder="All Programs"
                />
            </div>
            <div style={{ width: 180 }}>
                <SearchableSelect
                    value={semesterFilter}
                    onChange={handleSemesterFilterChange}
                    options={semesters
                        .filter(s => !programFilter || s.program_id.toString() === programFilter)
                        .map(s => ({ value: s.id.toString(), label: s.name + ' (' + s.code + ')' }))}
                    placeholder="All Semesters"
                />
            </div>
            <Button type="submit" variant="primary">
                Search
            </Button>
            <Button type="button" variant="secondary" onClick={() => {
                setSearch('');
                setProgramFilter('');
                setSemesterFilter('');
                router.get('/admin/courses');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Course Catalog"
            action={
                hasPermission('create classes') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Course
                    </Button>
                ) : undefined
            }
        >
            <Head title="Course Catalog" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={courses.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Add / Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingCourse ? 'Edit Course' : 'Add Course'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingCourse ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <SearchableSelect
                        label="Program"
                        required
                        value={data.program_id}
                        onChange={(e) => {
                            setData(d => ({ ...d, program_id: e.target.value, semester_id: '' }));
                        }}
                        options={programs.map(p => ({ value: p.id.toString(), label: p.name }))}
                        error={errors.program_id}
                    />
                    <SearchableSelect
                        label="Semester Offering"
                        required
                        disabled={!data.program_id}
                        value={data.semester_id}
                        onChange={(e) => setData('semester_id', e.target.value)}
                        options={filteredSemesters.map(s => ({ value: s.id.toString(), label: s.name + ' (' + s.code + ')' }))}
                        error={errors.semester_id}
                        placeholder={data.program_id ? 'Select Semester' : 'Select Program First'}
                    />
                    <Input
                        label="Course Name (English)"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Input
                        label="Course Name (Urdu)"
                        value={data.name_ur}
                        onChange={(e) => setData('name_ur', e.target.value)}
                        error={errors.name_ur}
                        placeholder="e.g. فقہ اول"
                    />
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 2 }}>
                            <Input
                                label="Course Code"
                                required
                                placeholder="e.g. DN-FIQH101"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                error={errors.code}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Credit Hours"
                                type="number"
                                required
                                value={data.credit_hours}
                                onChange={(e) => setData('credit_hours', parseInt(e.target.value) || 3)}
                                error={errors.credit_hours}
                            />
                        </div>
                    </div>
                    <SearchableSelect
                        label="Teacher Assignment"
                        value={data.teacher_id}
                        onChange={(e) => setData('teacher_id', e.target.value)}
                        options={teachers.map(t => ({ value: t.id.toString(), label: t.name }))}
                        placeholder="Select Teacher (Optional)"
                    />
                    
                    {/* Textbook mapping checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
                            Assigned Textbooks (Books)
                        </label>
                        <div style={{
                            border: '1px solid var(--border)',
                            borderRadius: 6,
                            padding: 12,
                            maxHeight: 160,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                        }}>
                            {books.map(book => (
                                <label key={book.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.book_ids.includes(book.id)}
                                        onChange={() => handleBookToggle(book.id)}
                                        style={{ accentColor: 'var(--color-primary)' }}
                                    />
                                    <span>{book.name} {book.urdu_name ? `(${book.urdu_name})` : ''}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Description (English)"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                    />
                    <Input
                        label="Description (Urdu)"
                        value={data.description_ur}
                        onChange={(e) => setData('description_ur', e.target.value)}
                        error={errors.description_ur}
                    />
                    <SearchableSelect
                        label="Status"
                        value={data.is_active ? '1' : '0'}
                        onChange={(e) => setData('is_active', e.target.value === '1')}
                        options={[
                            { value: '1', label: 'Active' },
                            { value: '0', label: 'Inactive' },
                        ]}
                    />
                </form>
            </Modal>

            {/* Manage Content Modal */}
            <Modal
                open={contentModalOpen}
                onClose={() => setContentModalOpen(false)}
                title={`Manage Content: ${currentCourse?.name} (${currentCourse?.code})`}
                size="xl"
            >
                <div className="flex flex-col gap-6">
                    {/* Tab Selector */}
                    <div className="flex border-b border-border/50 pb-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setActiveContentTab('resources')}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
                                activeContentTab === 'resources'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            📚 Study Resources ({currentCourse?.study_resources?.length ?? 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveContentTab('assignments')}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
                                activeContentTab === 'assignments'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            📝 Assignments ({currentCourse?.assignments?.length ?? 0})
                        </button>
                    </div>

                    {activeContentTab === 'resources' ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Resources list */}
                            <div className="md:col-span-7 flex flex-col gap-4">
                                <h3 className="text-base font-semibold text-foreground">Uploaded Resources</h3>
                                <div className="border border-border/50 rounded-lg max-h-[400px] overflow-y-auto divide-y divide-border/35 bg-background">
                                    {!currentCourse?.study_resources || currentCourse.study_resources.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            No study resources uploaded yet for this course.
                                        </div>
                                    ) : (
                                        currentCourse.study_resources.map(res => (
                                            <div key={res.id} className="p-4 flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-foreground truncate">{res.title}</span>
                                                        <Badge variant={res.file_type === 'pdf' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-mono">
                                                            {res.file_type}
                                                        </Badge>
                                                        <Badge variant={res.is_published ? 'success' : 'muted'} className="text-[10px]">
                                                            {res.is_published ? 'Published' : 'Draft'}
                                                        </Badge>
                                                    </div>
                                                    {res.description && <p className="text-xs text-muted-foreground line-clamp-2">{res.description}</p>}
                                                    <a
                                                        href={`/storage/${res.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1 font-medium"
                                                    >
                                                        Download / View File
                                                    </a>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this resource?')) {
                                                            deleteResource(res.id);
                                                        }
                                                    }}
                                                    className="text-destructive hover:bg-destructive/10 shrink-0"
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Resource upload form */}
                            <div className="md:col-span-5 border border-border/50 rounded-lg p-4 bg-muted/20">
                                <h3 className="text-base font-semibold text-foreground mb-4">Upload New Resource</h3>
                                <form onSubmit={handleResourceSubmit} className="flex flex-col gap-4">
                                    <Input
                                        label="Title *"
                                        required
                                        value={resourceForm.data.title}
                                        onChange={e => resourceForm.setData('title', e.target.value)}
                                        error={resourceForm.errors.title}
                                    />
                                    <Input
                                        label="Description"
                                        value={resourceForm.data.description}
                                        onChange={e => resourceForm.setData('description', e.target.value)}
                                        error={resourceForm.errors.description}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-muted-foreground">Select File *</label>
                                        <input
                                            type="file"
                                            onChange={e => resourceForm.setData('file', e.target.files?.[0] || null)}
                                            required
                                            className="w-full border border-border rounded-md px-3 py-2 text-sm text-foreground bg-background file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground file:hover:bg-primary/95 cursor-pointer file:cursor-pointer"
                                        />
                                        {resourceForm.errors.file && <p className="text-xs text-destructive mt-1">{resourceForm.errors.file}</p>}
                                    </div>
                                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={resourceForm.data.is_published}
                                            onChange={e => resourceForm.setData('is_published', e.target.checked)}
                                            className="h-4 w-4 rounded border-border text-primary"
                                        />
                                        <span>Publish immediately to students</span>
                                    </label>
                                    <Button type="submit" variant="primary" disabled={resourceForm.processing} className="w-full">
                                        {resourceForm.processing ? 'Uploading...' : 'Upload Resource'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Assignments list */}
                            <div className="md:col-span-7 flex flex-col gap-4">
                                <h3 className="text-base font-semibold text-foreground">Current Assignments</h3>
                                <div className="border border-border/50 rounded-lg max-h-[400px] overflow-y-auto divide-y divide-border/35 bg-background">
                                    {!currentCourse?.assignments || currentCourse.assignments.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            No assignments created yet for this course.
                                        </div>
                                    ) : (
                                        currentCourse.assignments.map(assign => (
                                            <div key={assign.id} className="p-4 flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-foreground truncate">{assign.title}</span>
                                                        <Badge variant={assign.is_published ? 'success' : 'muted'} className="text-[10px]">
                                                            {assign.is_published ? 'Published' : 'Draft'}
                                                        </Badge>
                                                    </div>
                                                    {assign.title_ur && (
                                                        <p className="text-xs text-muted-foreground font-medium mb-2 font-urdu">
                                                            {assign.title_ur}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{assign.description}</p>
                                                    {assign.description_ur && (
                                                        <p className="text-xs text-muted-foreground font-urdu line-clamp-3 mb-2">
                                                            {assign.description_ur}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-muted-foreground font-semibold">
                                                        <span>📅 Due: {assign.due_date}</span>
                                                        <span>💯 Max Marks: {assign.max_marks}</span>
                                                        <span>🕒 Late Allowed: {assign.allow_late_submission ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this assignment?')) {
                                                            deleteAssignment(assign.id);
                                                        }
                                                    }}
                                                    className="text-destructive hover:bg-destructive/10 shrink-0"
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Create Assignment form */}
                            <div className="md:col-span-5 border border-border/50 rounded-lg p-4 bg-muted/20">
                                <h3 className="text-base font-semibold text-foreground mb-4">Create New Assignment</h3>
                                <form onSubmit={handleAssignmentSubmit} className="flex flex-col gap-4">
                                    <Input
                                        label="Assignment Title (English) *"
                                        required
                                        value={assignmentForm.data.title}
                                        onChange={e => assignmentForm.setData('title', e.target.value)}
                                        error={assignmentForm.errors.title}
                                    />
                                    <Input
                                        label="Assignment Title (Urdu)"
                                        placeholder="مثال: ہوم ورک نمبر 1"
                                        value={assignmentForm.data.title_ur}
                                        onChange={e => assignmentForm.setData('title_ur', e.target.value)}
                                        error={assignmentForm.errors.title_ur}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-stone-750 dark:text-stone-300">Description (English) *</label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={assignmentForm.data.description}
                                            onChange={e => assignmentForm.setData('description', e.target.value)}
                                            className="w-full border border-stone-200 dark:border-stone-850 rounded-md px-3 py-2 text-sm text-foreground bg-background outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                        {assignmentForm.errors.description && <p className="text-xs text-destructive mt-1">{assignmentForm.errors.description}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-stone-750 dark:text-stone-300">Description (Urdu)</label>
                                        <textarea
                                            rows={2}
                                            placeholder="تفصیل اردو میں درج کریں..."
                                            value={assignmentForm.data.description_ur}
                                            onChange={e => assignmentForm.setData('description_ur', e.target.value)}
                                            className="w-full border border-stone-200 dark:border-stone-850 rounded-md px-3 py-2 text-sm text-foreground bg-background outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                        {assignmentForm.errors.description_ur && <p className="text-xs text-destructive mt-1">{assignmentForm.errors.description_ur}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Due Date *"
                                            type="datetime-local"
                                            required
                                            value={assignmentForm.data.due_date}
                                            onChange={e => assignmentForm.setData('due_date', e.target.value)}
                                            error={assignmentForm.errors.due_date}
                                        />
                                        <Input
                                            label="Max Marks *"
                                            type="number"
                                            required
                                            min={1}
                                            max={100}
                                            value={assignmentForm.data.max_marks}
                                            onChange={e => assignmentForm.setData('max_marks', parseInt(e.target.value) || 10)}
                                            error={assignmentForm.errors.max_marks}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 pt-2">
                                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={assignmentForm.data.allow_late_submission}
                                                onChange={e => assignmentForm.setData('allow_late_submission', e.target.checked)}
                                                className="h-4 w-4 rounded border-border text-primary"
                                            />
                                            <span>Allow late submission</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={assignmentForm.data.is_published}
                                                onChange={e => assignmentForm.setData('is_published', e.target.checked)}
                                                className="h-4 w-4 rounded border-border text-primary"
                                            />
                                            <span>Publish immediately to students</span>
                                        </label>
                                    </div>
                                    <Button type="submit" variant="primary" disabled={assignmentForm.processing} className="w-full mt-2">
                                        {assignmentForm.processing ? 'Creating...' : 'Create Assignment'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteCourse}
                onClose={() => setDeleteCourse(null)}
                onConfirm={handleDelete}
                title="Delete Course"
                message={`Are you sure you want to delete course "${deleteCourse?.name}" (${deleteCourse?.code})? All associated grades, schedules and marks will be deleted. This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
