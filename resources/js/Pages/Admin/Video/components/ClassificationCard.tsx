import React from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import type { Speaker, Category, Year } from '@/types/models';
import { TagInput } from '@/Components/ui/TagInput';

interface ClassificationProps {
    speakers: Speaker[];
    categories: Category[];
    years: Year[];
    speakerId: string | number;
    setSpeakerId: (val: string) => void;
    speakerError?: string;
    categoryId: string | number;
    setCategoryId: (val: string) => void;
    categoryError?: string;
    yearId: string | number;
    setYearId: (val: string) => void;
    yearError?: string;
    tags: string[];
    setTags: (tags: string[]) => void;
    tagsError?: string;
}

export function ClassificationCard({
    speakers,
    categories,
    years,
    speakerId,
    setSpeakerId,
    speakerError,
    categoryId,
    setCategoryId,
    categoryError,
    yearId,
    setYearId,
    yearError,
    tags,
    setTags,
    tagsError,
}: ClassificationProps) {

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-6">
            <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Video Organization
            </CardHeader>
            <CardBody className="p-8 space-y-6">
                
                {/* Searchable selectbox for Speaker */}
                <div className="space-y-2">
                    <SearchableSelect
                        label="Speaker / Scholar"
                        required
                        value={speakerId.toString()}
                        onChange={(e) => setSpeakerId(e.target.value)}
                        options={speakers.map(s => ({ value: s.id.toString(), label: s.name }))}
                        placeholder="Select Speaker / Scholar"
                        error={speakerError}
                    />
                </div>

                {/* Category select */}
                <div className="space-y-2">
                    <SearchableSelect
                        label="Category"
                        required
                        value={categoryId.toString()}
                        onChange={(e) => setCategoryId(e.target.value)}
                        options={categories.map(c => ({ value: c.id.toString(), label: c.name }))}
                        placeholder="Select Category"
                        error={categoryError}
                    />
                </div>

                {/* Year select */}
                <div className="space-y-2">
                    <SearchableSelect
                        label="Academic Year"
                        required
                        value={yearId.toString()}
                        onChange={(e) => setYearId(e.target.value)}
                        options={years.map(y => ({ value: y.id.toString(), label: y.name.toString() }))}
                        placeholder="Select Year"
                        error={yearError}
                    />
                </div>

                {/* Autocomplete TagInput */}
                <div className="space-y-2">
                    <TagInput
                        label="Tags"
                        value={tags}
                        onChange={setTags}
                        placeholder="e.g. fiqh, class"
                        error={tagsError}
                    />
                </div>

            </CardBody>
        </Card>
    );
}
