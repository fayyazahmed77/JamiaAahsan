import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentsStepProps {
    data: {
        birth_certificate: File | null;
        education_degree: File | null;
    };
    setData: (key: any, value: any) => void;
    errors: Record<string, string>;
    isUrdu: boolean;
}

export default function DocumentsStep({ data, setData, errors, isUrdu }: DocumentsStepProps) {
    const birthInputRef = useRef<HTMLInputElement>(null);
    const degreeInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (field: 'birth_certificate' | 'education_degree', file: File | null) => {
        setData(field, file);
    };

    return (
        <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold leading-relaxed">
                    {isUrdu 
                        ? 'برائے مہربانی صرف PDF، JPG، JPEG یا PNG فارمیٹ میں فائلیں اپلوڈ کریں۔ ہر فائل کا سائز 2MB سے زیادہ نہیں ہونا چاہئے۔'
                        : 'Please upload files in PDF, JPG, JPEG, or PNG format only. The maximum file size limit for each document is 2MB.'
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Birth Certificate File Upload Card */}
                <div className="space-y-2">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider block", isUrdu && "font-urdu text-[9px]")}>
                        {isUrdu ? 'پیدائشی سرٹیفکیٹ / ب-فارم کی کاپی' : 'Birth Certificate / B-Form Scanned Copy'}
                    </label>
                    <input 
                        type="file" 
                        ref={birthInputRef}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('birth_certificate', e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    
                    {data.birth_certificate ? (
                        <div className="border border-stone-200 dark:border-stone-850 rounded-2xl p-4 flex items-center justify-between bg-stone-50 dark:bg-sapphire-950/20">
                            <div className="flex items-center gap-3 min-w-0">
                                <FileText className="w-8 h-8 text-sapphire-500 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                                        {data.birth_certificate.name}
                                    </p>
                                    <p className="text-[10px] text-stone-400 font-semibold">
                                        {(data.birth_certificate.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => handleFileChange('birth_certificate', null)}
                                className="w-7 h-7 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => birthInputRef.current?.click()}
                            className={cn(
                                "w-full border-2 border-dashed border-stone-250 dark:border-stone-800 rounded-2xl p-6 flex flex-col items-center justify-center bg-card hover:bg-stone-50/50 dark:hover:bg-stone-900/10 hover:border-sapphire-500/30 transition-all",
                                errors.birth_certificate && "border-red-500 dark:border-red-500"
                            )}
                        >
                            <Upload className="w-8 h-8 text-stone-400 mb-2" />
                            <span className={cn("text-xs font-bold text-stone-700 dark:text-stone-300", isUrdu && "font-urdu")}>
                                {isUrdu ? 'فائل منتخب کریں' : 'Choose Scanned File'}
                            </span>
                            <span className="text-[10px] text-stone-400 mt-1">PDF, PNG, JPG (Max 2MB)</span>
                        </button>
                    )}
                    {errors.birth_certificate && (
                        <p className="text-[11px] font-bold text-red-500">{errors.birth_certificate}</p>
                    )}
                </div>

                {/* Education Degree Scanned Copy Upload Card */}
                <div className="space-y-2">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider block", isUrdu && "font-urdu text-[9px]")}>
                        {isUrdu ? 'سابقہ تعلیمی ڈگری / سرٹیفکیٹ کی کاپی' : 'Educational Certificate / Degree Scanned Copy'}
                    </label>
                    <input 
                        type="file" 
                        ref={degreeInputRef}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('education_degree', e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    
                    {data.education_degree ? (
                        <div className="border border-stone-200 dark:border-stone-850 rounded-2xl p-4 flex items-center justify-between bg-stone-50 dark:bg-sapphire-950/20">
                            <div className="flex items-center gap-3 min-w-0">
                                <FileText className="w-8 h-8 text-sapphire-500 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                                        {data.education_degree.name}
                                    </p>
                                    <p className="text-[10px] text-stone-400 font-semibold">
                                        {(data.education_degree.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => handleFileChange('education_degree', null)}
                                className="w-7 h-7 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => degreeInputRef.current?.click()}
                            className={cn(
                                "w-full border-2 border-dashed border-stone-250 dark:border-stone-800 rounded-2xl p-6 flex flex-col items-center justify-center bg-card hover:bg-stone-50/50 dark:hover:bg-stone-900/10 hover:border-sapphire-500/30 transition-all",
                                errors.education_degree && "border-red-500 dark:border-red-500"
                            )}
                        >
                            <Upload className="w-8 h-8 text-stone-400 mb-2" />
                            <span className={cn("text-xs font-bold text-stone-700 dark:text-stone-300", isUrdu && "font-urdu")}>
                                {isUrdu ? 'فائل منتخب کریں' : 'Choose Scanned File'}
                            </span>
                            <span className="text-[10px] text-stone-400 mt-1">PDF, PNG, JPG (Max 2MB)</span>
                        </button>
                    )}
                    {errors.education_degree && (
                        <p className="text-[11px] font-bold text-red-500">{errors.education_degree}</p>
                    )}
                </div>

            </div>
        </div>
    );
}
