import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Select } from '@/Components/ui/Select';
import { Input } from '@/Components/ui/Input';
import type { UserDetail, LogAdmissionClass } from '@/types/models';
import { ArrowLeft, User, Calendar, BookOpen, Clock, FileText, Check, X, ShieldAlert } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';

interface Props {
    admission: UserDetail & { id: number };
    logs: LogAdmissionClass[];
    classes: { id: number; name: string }[];
}

export default function AdmissionsShow({ admission, logs, classes }: Props) {
    const [rejecting, setRejecting] = useState(false);
    const { hasPermission } = usePermission();

    const { data: rejectData, setData: setRejectData, post: postReject, processing: processingReject } = useForm({
        note: '',
    });

    const { data: transferData, setData: setTransferData, post: postTransfer, processing: processingTransfer, errors: transferErrors } = useForm({
        class_id: admission.class_id,
        note: '',
    });

    const handleApprove = () => {
        router.post(`/admin/admissions/${admission.id}/approve`);
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        postReject(`/admin/admissions/${admission.id}/reject`, {
            onSuccess: () => setRejecting(false),
        });
    };

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        postTransfer(`/admin/admissions/${admission.id}/transfer`);
    };

    return (
        <AdminLayout
            title="Admission Details"
            breadcrumbs={[
                { label: 'Student Admissions', href: '/admin/admissions' },
                { label: admission.user?.name || 'Details' }
            ]}
            action={
                <Link href="/admin/admissions">
                    <Button variant="secondary" className="flex items-center gap-1.5">
                        <ArrowLeft size={16} /> Back to List
                    </Button>
                </Link>
            }
        >
            <Head title={`Admission - ${admission.user?.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Applicant Bio Profile */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader className="border-b border-border pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <User size={20} className="text-primary" /> Student Profile
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-4">
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Full Name</span>
                                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{admission.user?.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Father / Guardian Name</span>
                                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{admission.guardian_name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email Address</span>
                                <p className="font-medium text-sm">{admission.user?.email}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Contact Number</span>
                                <p className="font-medium text-sm">{admission.phone}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">ID Card / CNIC No.</span>
                                <p className="font-medium text-sm">{admission.id_card_no}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Date of Birth</span>
                                <p className="font-medium text-sm">{admission.dob || '-'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Class Applying For</span>
                                <p className="font-semibold text-primary">{admission.class?.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Admission Category</span>
                                <p className="font-medium text-sm capitalize">{admission.admission_type || 'regular'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Residential Address</span>
                                <p className="text-sm mt-0.5">{admission.address}</p>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Previous Academic Qualification</span>
                                <p className="text-sm mt-0.5">{admission.qualification}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Uploaded Documents Credentials */}
                    <Card>
                        <CardHeader className="border-b border-border pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <FileText size={20} className="text-primary" /> Credentials & Documents
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="flex flex-col gap-4 py-4">
                            <div className="flex items-center justify-between p-3 bg-stone-50/5 border border-border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-muted-foreground" size={24} />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">Birth Certificate / B-Form</span>
                                        <span className="text-xs text-muted-foreground">Uploaded student ID proof</span>
                                    </div>
                                </div>
                                {admission.birth_certificate_path ? (
                                    <a href={`/storage/${admission.birth_certificate_path}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="secondary" size="sm">View File</Button>
                                    </a>
                                ) : (
                                    <span className="text-xs text-muted-foreground">Not uploaded</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 bg-stone-50/5 border border-border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-muted-foreground" size={24} />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">Educational Degree / Sanad</span>
                                        <span className="text-xs text-muted-foreground">Uploaded certification document</span>
                                    </div>
                                </div>
                                {admission.education_degree_path ? (
                                    <a href={`/storage/${admission.education_degree_path}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="secondary" size="sm">View File</Button>
                                    </a>
                                ) : (
                                    <span className="text-xs text-muted-foreground">Not uploaded</span>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Sidebar: Status Actions, Class Transfer, Logs */}
                <div className="flex flex-col gap-6">
                    {/* Status & Quick Action Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Console</CardTitle>
                        </CardHeader>
                        <CardBody className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Approval Status:</span>
                                <Badge variant={admission.is_approved ? 'success' : 'warning'}>
                                    {admission.is_approved ? 'Approved' : 'Pending Review'}
                                </Badge>
                            </div>

                            {admission.registration_no && (
                                <div className="flex items-center justify-between border-t border-border pt-3">
                                    <span className="text-sm font-medium">Registration No:</span>
                                    <span className="font-mono font-bold text-primary">{admission.registration_no}</span>
                                </div>
                            )}

                             {hasPermission('edit admissions') && !admission.is_approved && !rejecting && (
                                <div className="flex gap-2 border-t border-border pt-4">
                                    <Button variant="primary" onClick={handleApprove} className="flex-1 flex items-center justify-center gap-1">
                                        <Check size={16} /> Approve
                                    </Button>
                                    <Button variant="destructive" onClick={() => setRejecting(true)} className="flex-1 flex items-center justify-center gap-1">
                                        <X size={16} /> Reject
                                    </Button>
                                </div>
                            )}

                            {hasPermission('edit admissions') && rejecting && (
                                <form onSubmit={handleReject} className="flex flex-col gap-3 border-t border-border pt-4">
                                    <Input
                                        label="Reason for rejection / note"
                                        required
                                        value={rejectData.note}
                                        onChange={(e) => setRejectData('note', e.target.value)}
                                        placeholder="E.g., Missing documents"
                                    />
                                    <div className="flex gap-2">
                                        <Button type="button" variant="secondary" size="sm" onClick={() => setRejecting(false)} className="flex-1">
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="destructive" size="sm" disabled={processingReject} className="flex-1">
                                            Submit Rejection
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardBody>
                    </Card>

                    {/* Class Transfer Card */}
                    {hasPermission('edit admissions') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Transfer Class</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={handleTransfer} className="flex flex-col gap-4">
                                    <Select
                                        label="New Class"
                                        value={transferData.class_id.toString()}
                                        onChange={(e) => setTransferData('class_id', parseInt(e.target.value) || 0)}
                                        options={classes.map(cl => ({ value: cl.id.toString(), label: cl.name }))}
                                        error={transferErrors.class_id}
                                    />
                                    <Input
                                        label="Reason for transfer"
                                        required
                                        value={transferData.note}
                                        onChange={(e) => setTransferData('note', e.target.value)}
                                        error={transferErrors.note}
                                        placeholder="Enter reasoning..."
                                    />
                                    <Button type="submit" variant="primary" disabled={processingTransfer} className="w-full">
                                        Apply Transfer
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    )}

                    {/* Logs History / Workflow Timeline */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock size={18} /> Audit Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="max-h-[300px] overflow-y-auto flex flex-col gap-4">
                            {logs.length === 0 ? (
                                <div className="text-center text-xs text-muted-foreground py-4">
                                    No logged transitions found.
                                </div>
                            ) : (
                                <div className="relative border-l border-border ml-2 pl-4 flex flex-col gap-6">
                                    {logs.map((log) => (
                                        <div key={log.id} className="relative">
                                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-primary">{log.admin?.name || 'System'}</span>
                                                <span className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>
                                                <p className="text-xs mt-1 text-muted-foreground">{log.note}</p>
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
