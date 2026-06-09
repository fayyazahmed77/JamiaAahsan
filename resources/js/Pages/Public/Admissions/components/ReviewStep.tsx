import React from 'react';
import type { Klass } from '@/types/models';
import { cn } from '@/lib/utils';
import { Check, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface ReviewStepProps {
    data: {
        name: string;
        email: string;
        gender: string;
        dob: string;
        id_card_no: string;
        phone: string;
        address: string;
        country: string;
        class_id: string | number;
        qualification: string;
        guardian_name: string;
        admission_type: string;
        birth_certificate: File | null;
        education_degree: File | null;
    };
    classes: Klass[];
    isUrdu: boolean;
}

export default function ReviewStep({ data, classes, isUrdu }: ReviewStepProps) {
    const selectedClass = classes.find(c => c.id.toString() === data.class_id.toString());

    const getGenderLabel = (g: string) => {
        if (g === 'male') return isUrdu ? 'مرد' : 'Male';
        if (g === 'female') return isUrdu ? 'عورت' : 'Female';
        return g;
    };

    const getAdmissionTypeLabel = (t: string) => {
        if (t === 'regular') return isUrdu ? 'باقاعدہ (ریگولر)' : 'Regular (On-site)';
        if (t === 'distance') return isUrdu ? 'فاصلاتی نظام تعلیم (آن لائن)' : 'Distance Learning (Online)';
        if (t === 'part-time') return isUrdu ? 'جز وقتی (پارٹ ٹائم)' : 'Part-time';
        return t;
    };

    return (
        <div className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 rounded-2xl p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold leading-relaxed">
                    {isUrdu 
                        ? 'آپ کی معلومات کا جائزہ مکمل ہو گیا ہے۔ براہِ کرم نیچے دی گئی تفصیلات چیک کریں اور حتمی جمع کرانے کے لیے "درخواست جمع کریں" بٹن پر کلک کریں۔'
                        : 'Your details review is ready. Please check the summary below and click "Submit Application" to finalize your request.'
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account & Personal Summary */}
                <div className="bg-stone-50 dark:bg-sapphire-950/20 border border-stone-200 dark:border-stone-850 rounded-2xl p-5 space-y-4">
                    <h3 className={cn("text-xs font-black uppercase text-stone-400 tracking-wider border-b border-stone-200 dark:border-stone-800 pb-2", isUrdu && "font-urdu text-[11px]")}>
                        {isUrdu ? 'ذاتی تفصیلات' : 'Personal Details'}
                    </h3>
                    <div className="space-y-3 text-sm font-semibold">
                        <div>
                            <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'نام' : 'Full Name'}</span>
                            <span className="text-stone-900 dark:text-white">{data.name}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'ای میل' : 'Email Address'}</span>
                            <span className="text-stone-900 dark:text-white">{data.email}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'جنس' : 'Gender'}</span>
                                <span className="text-stone-900 dark:text-white">{getGenderLabel(data.gender)}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'تاریخِ پیدائش' : 'Date of Birth'}</span>
                                <span className="text-stone-900 dark:text-white">{data.dob}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'شناختی کارڈ نمبر / ب-فارم' : 'ID Card Number'}</span>
                                <span className="text-stone-900 dark:text-white">{data.id_card_no}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'رابطہ نمبر' : 'Phone'}</span>
                                <span className="text-stone-900 dark:text-white">{data.phone}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'مکمل پتہ' : 'Residential Address'}</span>
                            <span className="text-stone-900 dark:text-white leading-relaxed">{data.address}</span>
                        </div>
                    </div>
                </div>

                {/* Academic & Documents Summary */}
                <div className="bg-stone-50 dark:bg-sapphire-950/20 border border-stone-200 dark:border-stone-850 rounded-2xl p-5 space-y-4">
                    <h3 className={cn("text-xs font-black uppercase text-stone-400 tracking-wider border-b border-stone-200 dark:border-stone-800 pb-2", isUrdu && "font-urdu text-[11px]")}>
                        {isUrdu ? 'تعلیمی تفصیلات اور دستاویزات' : 'Academic & Documents'}
                    </h3>
                    <div className="space-y-3 text-sm font-semibold">
                        <div>
                            <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'مطلوبہ پروگرام' : 'Applied Program'}</span>
                            <span className="text-sapphire-600 dark:text-sapphire-400 font-bold">{selectedClass ? selectedClass.name : ''}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'سرپرست کا نام' : 'Guardian Name'}</span>
                            <span className="text-stone-900 dark:text-white">{data.guardian_name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'سابقہ تعلیمی ڈگری' : 'Last Qualification'}</span>
                                <span className="text-stone-900 dark:text-white">{data.qualification}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-stone-450 uppercase block">{isUrdu ? 'داخلہ کی قسم' : 'Admission Type'}</span>
                                <span className="text-stone-900 dark:text-white">{getAdmissionTypeLabel(data.admission_type)}</span>
                            </div>
                        </div>
                        
                        <div className="pt-2 space-y-2.5">
                            <span className="text-[10px] text-stone-450 uppercase block border-t border-stone-200 dark:border-stone-800 pt-3">
                                {isUrdu ? 'منسلکہ دستاویزات' : 'Attached Documents'}
                            </span>
                            
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center border",
                                    data.birth_certificate 
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                                        : "bg-stone-100 border-stone-250 text-stone-450"
                                )}>
                                    {data.birth_certificate ? <Check className="w-3.5 h-3.5" /> : null}
                                </div>
                                <span className="text-xs text-stone-700 dark:text-stone-300">
                                    {isUrdu ? 'پیدائشی سرٹیفکیٹ / ب-فارم' : 'Birth Certificate / B-Form'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center border",
                                    data.education_degree 
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                                        : "bg-stone-100 border-stone-250 text-stone-450"
                                )}>
                                    {data.education_degree ? <Check className="w-3.5 h-3.5" /> : null}
                                </div>
                                <span className="text-xs text-stone-700 dark:text-stone-300">
                                    {isUrdu ? 'سابقہ تعلیمی سرٹیفکیٹ / ڈگری' : 'Educational Certificate / Degree'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
