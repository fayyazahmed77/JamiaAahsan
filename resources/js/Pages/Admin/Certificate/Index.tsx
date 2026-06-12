import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import { Plus, Download, Trash2, Eye, ShieldCheck, Save, Search } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    student_id_number: string;
}

interface Certificate {
    id: number;
    student_id: number;
    type: 'completion' | 'hifz' | 'participation';
    code: string;
    title: string;
    title_ur: string | null;
    issued_date: string;
    pdf_path: string | null;
    student?: Student;
}

interface Props {
    certificates: {
        data: Certificate[];
        current_page: number;
        last_page: number;
    };
    students: Student[];
}

export default function CertificateIndex({ certificates, students }: Props) {
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, reset, processing, errors } = useForm({
        student_id: '',
        type: 'completion' as 'completion' | 'hifz' | 'participation',
        title: '',
        title_ur: '',
        issued_date: new Date().toISOString().substring(0, 10),
        valid_until: '',
    });

    const handleIssueSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/certificates', {
            onSuccess: () => {
                reset();
                setShowIssueModal(false);
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this certificate? This will invalidate the verification code.')) {
            router.delete(`/admin/certificates/${id}`);
        }
    };

    const getCertTypeColor = (type: Certificate['type']) => {
        switch (type) {
            case 'hifz':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'completion':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'participation':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-stone-100 text-stone-800 border-stone-200';
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout
            title="Certificates & Graduations"
            breadcrumbs={[
                { label: 'Academics', href: '#' },
                { label: 'Certificates' }
            ]}
            action={
                <Button variant="primary" onClick={() => { setShowIssueModal(true); reset(); }} className="flex items-center gap-1.5">
                    <Plus size={16} /> Issue Certificate
                </Button>
            }
        >
            <Head title="Certificates Management" />

            <div className="flex flex-col gap-6">
                {/* List Card */}
                <Card>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-stone-50/5">
                                        <th className="p-4 font-semibold text-muted-foreground">Verification Code</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Student</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Type</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Certificate Title</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Issued Date</th>
                                        <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificates.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                No certificates issued yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        certificates.data.map((cert) => (
                                            <tr key={cert.id} className="border-b border-border hover:bg-stone-50/5 transition-colors">
                                                <td className="p-4 font-mono font-semibold text-primary flex items-center gap-1.5">
                                                    <ShieldCheck size={14} className="text-primary" />
                                                    {cert.code}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{cert.student?.name}</span>
                                                        <span className="text-xs text-muted-foreground">{cert.student?.student_id_number}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${getCertTypeColor(cert.type)}`}>
                                                        {cert.type}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground">{cert.title}</span>
                                                        {cert.title_ur && (
                                                            <span className="text-xs text-muted-foreground font-urdu text-right" dir="rtl">
                                                                {cert.title_ur}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {new Date(cert.issued_date).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <a 
                                                            href={route('certificate.verify', cert.code)} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-stone-50/5"
                                                            title="View Verification Page"
                                                        >
                                                            <Eye size={16} />
                                                        </a>
                                                        <a 
                                                            href={`/admin/certificates/${cert.id}/download`}
                                                            className="p-1.5 rounded-md text-primary hover:bg-primary/10"
                                                            title="Download PDF"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                        <button 
                                                            onClick={() => handleDelete(cert.id)}
                                                            className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 border-none cursor-pointer outline-none"
                                                            title="Invalidate/Delete"
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

                {/* Issue Certificate Modal */}
                {showIssueModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-lg">
                            <CardBody>
                                <h3 className="font-semibold text-lg border-b pb-2 border-border mb-4" style={{ color: 'var(--text-primary)' }}>
                                    Issue New Certificate
                                </h3>
                                <form onSubmit={handleIssueSubmit} className="flex flex-col gap-4">
                                    {/* Student Search & Select */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold">Search Student</label>
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Type student name or ID..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 border rounded-md bg-background text-sm"
                                            />
                                        </div>
                                        <Select
                                            label="Select Student Result"
                                            value={data.student_id}
                                            onChange={(e) => setData('student_id', e.target.value)}
                                            options={[
                                                { value: '', label: 'Select a student from matches...' },
                                                ...filteredStudents.map(student => ({
                                                    value: student.id.toString(),
                                                    label: `${student.name} (${student.student_id_number})`
                                                }))
                                            ]}
                                            error={errors.student_id}
                                            required
                                        />
                                    </div>

                                    {/* Type */}
                                    <Select
                                        label="Certificate Type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value as any)}
                                        options={[
                                            { value: 'completion', label: 'Completion Certificate' },
                                            { value: 'hifz', label: 'Hifz Graduation' },
                                            { value: 'participation', label: 'Participation Certificate' },
                                        ]}
                                    />

                                    {/* Title */}
                                    <Input
                                        label="Certificate Title (English)"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={errors.title}
                                        placeholder="E.g., Dars-e-Nizami Alim Course"
                                        required
                                    />

                                    <Input
                                        label="Certificate Title (Urdu)"
                                        value={data.title_ur}
                                        onChange={(e) => setData('title_ur', e.target.value)}
                                        error={errors.title_ur}
                                        placeholder="مثال: درس نظامی عالم کورس"
                                        className="font-urdu text-right"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="date"
                                            label="Issued Date"
                                            value={data.issued_date}
                                            onChange={(e) => setData('issued_date', e.target.value)}
                                            error={errors.issued_date}
                                            required
                                        />
                                        <Input
                                            type="date"
                                            label="Valid Until (Optional)"
                                            value={data.valid_until}
                                            onChange={(e) => setData('valid_until', e.target.value)}
                                            error={errors.valid_until}
                                        />
                                    </div>

                                    <div className="flex gap-2 justify-end border-t pt-4 border-border mt-2">
                                        <Button type="button" variant="secondary" onClick={() => setShowIssueModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-1.5">
                                            <Save size={16} /> Issue & Generate
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
