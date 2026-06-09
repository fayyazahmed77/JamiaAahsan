import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody, CardFooter } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import { Textarea } from '@/Components/ui/Textarea';
import { RichTextEditor } from '@/Components/ui/RichTextEditor';
import { Save, ArrowLeft } from 'lucide-react';

interface Props {
    topics: { id: number; title: string }[];
}

export default function QACreate({ topics }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        topic_id: topics[0]?.id ? String(topics[0].id) : '',
        title: '',
        question: '',
        answer: '',
        status: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/qa/questions');
    };

    return (
        <AdminLayout
            title="Create Question"
            action={
                <Button variant="secondary" asChild>
                    <Link href="/admin/qa/questions" className="flex items-center gap-1.5 font-bold">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Link>
                </Button>
            }
        >
            <Head title="Create Question - Admin" />

            <form onSubmit={handleSubmit}>
                <Card className="max-w-full mx-auto shadow-md">
                    <CardBody className="space-y-6">
                        
                        {/* Title and Topic fields in Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-0.5">
                                    <span>Title</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                    placeholder="اردو میں لکھیں..."
                                    className="rounded-xl border-stone-200 dark:border-stone-800 font-urdu rtl:text-right text-right"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-0.5">
                                    <span>Topic</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={data.topic_id}
                                    onChange={(e: { target: { value: string; }; }) => setData('topic_id', e.target.value)}
                                    error={errors.topic_id}
                                    options={topics.map((t) => ({ value: String(t.id), label: t.title }))}
                                    className="rounded-xl border-stone-200 dark:border-stone-800 font-urdu"
                                />
                            </div>

                        </div>

                        {/* Status and Question fields in Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-0.5">
                                    <span>Status</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={data.status ? '1' : '0'}
                                    onChange={(e: { target: { value: string; }; }) => setData('status', e.target.value === '1')}
                                    error={errors.status}
                                    options={[
                                        { value: '1', label: 'Active' },
                                        { value: '0', label: 'Inactive' },
                                    ]}
                                    className="rounded-xl border-stone-200 dark:border-stone-800"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-0.5">
                                    <span>Question</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    error={errors.question}
                                    placeholder="سوال..."
                                    rows={3}
                                    className="rounded-xl border-stone-200 dark:border-stone-800 font-urdu rtl:text-right text-right"
                                    required
                                />
                            </div>

                        </div>

                        {/* Answer Field (RichTextEditor) */}
                        <div className="space-y-1">
                            <RichTextEditor
                                label="Answer"
                                required
                                value={data.answer}
                                onChange={(val) => setData('answer', val)}
                                error={errors.answer}
                                placeholder="جواب..."
                            />
                        </div>

                    </CardBody>

                    <CardFooter className="flex justify-end bg-stone-50 dark:bg-stone-900/40 p-4 border-t border-stone-100 dark:border-stone-800 gap-3">
                        <Button 
                            type="button" 
                            variant="secondary" 
                            asChild
                        >
                            <Link href="/admin/qa/questions">Cancel</Link>
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={processing}
                            className="flex items-center gap-2 px-5 font-bold"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </AdminLayout>
    );
}


