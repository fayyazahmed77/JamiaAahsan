import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Modal } from '@/Components/ui/Modal';
import type { PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, X, CreditCard, ShieldAlert, Image, RefreshCw, Eye } from 'lucide-react';

interface Program {
    id: number;
    name: string;
}

interface StudentRow {
    id: number;
    name: string;
    student_id_number: string;
    program_name?: string;
    current_semester?: number;
    profile_photo_url: string | null;
    pending_profile_photo_url: string | null;
    photo_status: 'none' | 'pending' | 'approved' | 'rejected';
    has_card: boolean;
    card_number: string | null;
    card_active: boolean;
}

interface Props {
    students: {
        data: StudentRow[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    programs: Program[];
    filters: {
        search?: string;
        program_id?: string;
        photo_status?: string;
    };
}

export default function IdCardIndex({ students, programs, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [programFilter, setProgramFilter] = useState(filters.program_id ?? '');
    const [photoStatusFilter, setPhotoStatusFilter] = useState(filters.photo_status ?? '');
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, programFilter, photoStatusFilter);
    };

    const applyFilters = (searchText: string, progId: string, statusText: string) => {
        router.get(
            '/admin/id-cards',
            {
                search: searchText || undefined,
                program_id: progId || undefined,
                photo_status: statusText || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setProgramFilter('');
        setPhotoStatusFilter('');
        router.get('/admin/id-cards');
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/id-cards',
            {
                page,
                search: search || undefined,
                program_id: programFilter || undefined,
                photo_status: photoStatusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const approvePhoto = (studentId: number) => {
        router.post(`/admin/id-cards/${studentId}/approve-photo`);
    };

    const rejectPhoto = (studentId: number) => {
        router.post(`/admin/id-cards/${studentId}/reject-photo`);
    };

    const issueCard = (studentId: number) => {
        router.post(`/admin/id-cards/${studentId}/issue`);
    };

    const columns: ColumnDef<StudentRow>[] = [
        {
            accessorKey: 'student_id_number',
            header: 'Student ID',
            cell: ({ row }) => (
                <div style={{ fontWeight: 700, color: '#1e6b3e' }}>
                    {row.original.student_id_number}
                </div>
            ),
            size: 110,
        },
        {
            accessorKey: 'name',
            header: 'Student Name',
            cell: ({ row }) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {row.original.name}
                    </div>
                    <div style={{ fontSize: '0.85em', color: 'var(--text-subtle)' }}>
                        {row.original.program_name ?? 'No Program'} · Sem {row.original.current_semester ?? 1}
                    </div>
                </div>
            ),
        },
        {
            id: 'photos',
            header: 'Photo Audit',
            cell: ({ row }) => {
                const s = row.original;
                return (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {/* Active Photo */}
                        <div style={{ textAlign: 'center' }}>
                            <div 
                                style={{
                                    width: 44, height: 44, borderRadius: 6,
                                    border: '1px solid var(--border)', background: 'var(--surface-3)',
                                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative'
                                }}
                            >
                                {s.profile_photo_url ? (
                                    <img src={s.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Image size={18} style={{ opacity: 0.3 }} />
                                )}
                            </div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-subtle)', marginTop: 2 }}>Active</div>
                        </div>

                        {/* Pending Photo Submission */}
                        {s.pending_profile_photo_url && (
                            <div style={{ textAlign: 'center' }}>
                                <div 
                                    onClick={() => setPreviewImageUrl(s.pending_profile_photo_url)}
                                    style={{
                                        width: 44, height: 44, borderRadius: 6,
                                        border: '1px solid #fbbf24', background: 'rgba(251,191,36,0.05)',
                                        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative', cursor: 'pointer'
                                    }}
                                    title="Click to preview"
                                >
                                    <img src={s.pending_profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#fbbf24', color: 'black', padding: '1px 3px', fontSize: '0.5rem', fontWeight: 800 }}>
                                        NEW
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.6rem', color: '#b45309', fontWeight: 600, marginTop: 2 }}>Pending</div>
                            </div>
                        )}
                    </div>
                );
            },
            size: 140,
        },
        {
            accessorKey: 'photo_status',
            header: 'Photo Status',
            cell: ({ row }) => {
                const status = row.original.photo_status;
                const variants: Record<string, 'success' | 'warning' | 'destructive' | 'muted'> = {
                    approved: 'success',
                    pending: 'warning',
                    rejected: 'destructive',
                    none: 'muted',
                };
                return (
                    <Badge variant={variants[status] || 'muted'}>
                        {status.toUpperCase()}
                    </Badge>
                );
            },
            size: 110,
        },
        {
            id: 'card_status',
            header: 'ID Card Status',
            cell: ({ row }) => {
                const s = row.original;
                return (
                    <div>
                        {s.has_card ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Badge variant="success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <CreditCard size={12} />
                                    ISSUED
                                </Badge>
                                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-subtle)' }}>
                                    {s.card_number}
                                </div>
                            </div>
                        ) : (
                            <Badge variant="warning">NOT ISSUED</Badge>
                        )}
                    </div>
                );
            },
            size: 130,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const s = row.original;
                return (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {s.photo_status === 'pending' && hasPermission('edit students') && (
                            <>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={() => approvePhoto(s.id)}
                                    style={{ padding: '4px 8px', background: '#1e6b3e', display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <Check size={12} />
                                    Approve & Issue
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => rejectPhoto(s.id)}
                                    style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <X size={12} />
                                    Reject
                                </Button>
                            </>
                        )}

                        {s.photo_status !== 'pending' && hasPermission('edit students') && (
                            <Button 
                                variant={s.has_card ? 'secondary' : 'primary'} 
                                size="sm" 
                                onClick={() => issueCard(s.id)}
                                disabled={!s.profile_photo_url}
                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                title={!s.profile_photo_url ? 'Requires an approved profile photo first' : ''}
                            >
                                <CreditCard size={12} />
                                {s.has_card ? 'Reissue ID' : 'Issue ID Card'}
                            </Button>
                        )}
                    </div>
                );
            },
            size: 200,
        },
    ];

    const meta: PageMeta = {
        current_page: students.current_page,
        last_page: students.last_page,
        per_page: students.per_page,
        total: students.total,
        from: students.from,
        to: students.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search by student name or ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>
            <div style={{ width: 200 }}>
                <SearchableSelect
                    value={programFilter}
                    onChange={e => {
                        setProgramFilter(e.target.value);
                        applyFilters(search, e.target.value, photoStatusFilter);
                    }}
                    options={programs.map(p => ({ value: p.id.toString(), label: p.name }))}
                    placeholder="All Programs"
                />
            </div>
            <div style={{ width: 180 }}>
                <SearchableSelect
                    value={photoStatusFilter}
                    onChange={e => {
                        setPhotoStatusFilter(e.target.value);
                        applyFilters(search, programFilter, e.target.value);
                    }}
                    options={[
                        { value: 'none', label: 'No Photo' },
                        { value: 'pending', label: 'Pending Approval' },
                        { value: 'approved', label: 'Approved Photo' },
                        { value: 'rejected', label: 'Rejected Photo' },
                    ]}
                    placeholder="All Photo Statuses"
                />
            </div>
            <Button type="submit" variant="primary">
                Search
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <RefreshCw size={14} />
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout title="Digital ID Card Issuance & Approval Desk">
            <Head title="ID Card Issuance & Photo Approvals" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={students.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Premium Photo Preview Modal */}
            <Modal
                open={!!previewImageUrl}
                onClose={() => setPreviewImageUrl(null)}
                title="Verify Passport Photograph"
                footer={
                    <Button variant="secondary" onClick={() => setPreviewImageUrl(null)}>
                        Close Preview
                    </Button>
                }
            >
                {previewImageUrl && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 12 }}>
                        <div 
                            style={{ 
                                width: 220, height: 220, borderRadius: 12, overflow: 'hidden',
                                border: '3px solid #d4af37', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' 
                            }}
                        >
                            <img src={previewImageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>
                            ⚠️ Check if the photograph is a recent, clear, passport-size format with a plain background before confirming approval.
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
