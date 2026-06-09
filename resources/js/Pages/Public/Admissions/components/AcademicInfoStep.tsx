import React from 'react';
import { GraduationCap, Award, ShieldAlert, User } from 'lucide-react';
import { Input } from '@/Components/ui/Input';
import type { Klass } from '@/types/models';
import { cn } from '@/lib/utils';

interface AcademicInfoStepProps {
    data: {
        class_id: string | number;
        qualification: string;
        guardian_name: string;
        admission_type: string;
    };
    setData: (key: any, value: any) => void;
    errors: Record<string, string>;
    classes: Klass[];
    isUrdu: boolean;
}

export default function AcademicInfoStep({ data, setData, errors, classes, isUrdu }: AcademicInfoStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Desired Class Selection */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <GraduationCap className="w-3.5 h-3.5" />
                        {isUrdu ? 'مطلوبہ تعلیمی پروگرام / کلاس *' : 'Desired Academic Program / Class *'}
                    </label>
                    <select
                        value={data.class_id}
                        onChange={(e) => setData('class_id', e.target.value)}
                        className={cn(
                            "w-full h-10.5 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                            errors.class_id && "border-red-500 dark:border-red-500",
                            isUrdu && "text-right font-urdu"
                        )}
                    >
                        <option value="">{isUrdu ? 'پروگرام منتخب کریں' : 'Select Program'}</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                    {errors.class_id && (
                        <p className="text-[11px] font-bold text-red-500">{errors.class_id}</p>
                    )}
                </div>

                {/* Guardian Name */}
                <div className="space-y-1.5">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <User className="w-3.5 h-3.5" />
                        {isUrdu ? 'والد / سرپرست کا نام *' : 'Father / Guardian Name *'}
                    </label>
                    <Input 
                        type="text"
                        placeholder={isUrdu ? 'سرپرست کا نام درج کریں' : 'Enter guardian name'}
                        value={data.guardian_name}
                        onChange={(e) => setData('guardian_name', e.target.value)}
                        className={cn(
                            "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                            errors.guardian_name && "border-red-500"
                        )}
                    />
                    {errors.guardian_name && (
                        <p className="text-[11px] font-bold text-red-500">{errors.guardian_name}</p>
                    )}
                </div>

                {/* Previous Qualification */}
                <div className="space-y-1.5">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <Award className="w-3.5 h-3.5" />
                        {isUrdu ? 'سابقہ تعلیمی قابلیت / درجہ *' : 'Last Qualification / Grade *'}
                    </label>
                    <Input 
                        type="text"
                        placeholder={isUrdu ? 'مثال: میٹرک / میٹرک پلس ناظرہ' : 'e.g. Matric / Middle school / Hifz'}
                        value={data.qualification}
                        onChange={(e) => setData('qualification', e.target.value)}
                        className={cn(
                            "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                            errors.qualification && "border-red-500"
                        )}
                    />
                    {errors.qualification && (
                        <p className="text-[11px] font-bold text-red-500">{errors.qualification}</p>
                    )}
                </div>

                {/* Admission Type select */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {isUrdu ? 'داخلہ کی قسم' : 'Admission Type'}
                    </label>
                    <select
                        value={data.admission_type}
                        onChange={(e) => setData('admission_type', e.target.value)}
                        className={cn(
                            "w-full h-10.5 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                            isUrdu && "text-right font-urdu"
                        )}
                    >
                        <option value="regular">{isUrdu ? 'باقاعدہ (ریگولر)' : 'Regular (On-site)'}</option>
                        <option value="distance">{isUrdu ? 'فاصلاتی نظام تعلیم (آن لائن)' : 'Distance Learning (Online)'}</option>
                        <option value="part-time">{isUrdu ? 'جز وقتی (پارٹ ٹائم)' : 'Part-time'}</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
