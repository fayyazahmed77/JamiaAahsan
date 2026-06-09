import React from 'react';
import { User, Phone, MapPin, Calendar, Globe, CreditCard } from 'lucide-react';
import { Input } from '@/Components/ui/Input';
import { cn } from '@/lib/utils';

interface PersonalInfoStepProps {
    data: {
        gender: string;
        dob: string;
        id_card_no: string;
        phone: string;
        address: string;
        country: string;
    };
    setData: (key: any, value: any) => void;
    errors: Record<string, string>;
    isUrdu: boolean;
}

export default function PersonalInfoStep({ data, setData, errors, isUrdu }: PersonalInfoStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Gender select */}
                <div className="space-y-1.5">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <User className="w-3.5 h-3.5" />
                        {isUrdu ? 'جنس *' : 'Gender *'}
                    </label>
                    <select
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className={cn(
                            "w-full h-10.5 px-3 rounded-xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                            errors.gender && "border-red-500 dark:border-red-500",
                            isUrdu && "text-right font-urdu"
                        )}
                    >
                        <option value="">{isUrdu ? 'انتخاب کریں' : 'Select Gender'}</option>
                        <option value="male">{isUrdu ? 'مرد' : 'Male'}</option>
                        <option value="female">{isUrdu ? 'عورت' : 'Female'}</option>
                    </select>
                    {errors.gender && (
                        <p className="text-[11px] font-bold text-red-500">{errors.gender}</p>
                    )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <Calendar className="w-3.5 h-3.5" />
                        {isUrdu ? 'تاریخِ پیدائش *' : 'Date of Birth *'}
                    </label>
                    <Input 
                        type="date"
                        value={data.dob}
                        onChange={(e) => setData('dob', e.target.value)}
                        className={cn(
                            "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                            errors.dob && "border-red-500"
                        )}
                    />
                    {errors.dob && (
                        <p className="text-[11px] font-bold text-red-500">{errors.dob}</p>
                    )}
                </div>

                {/* ID Card Number */}
                <div className="space-y-1.5">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <CreditCard className="w-3.5 h-3.5" />
                        {isUrdu ? 'شناختی کارڈ نمبر / ب-فارم نمبر *' : 'ID Card / B-Form Number *'}
                    </label>
                    <Input 
                        type="text"
                        placeholder={isUrdu ? 'مثال: 42101-1234567-1' : 'e.g. 42101-1234567-1'}
                        value={data.id_card_no}
                        onChange={(e) => setData('id_card_no', e.target.value)}
                        className={cn(
                            "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                            errors.id_card_no && "border-red-500"
                        )}
                    />
                    {errors.id_card_no && (
                        <p className="text-[11px] font-bold text-red-500">{errors.id_card_no}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <Phone className="w-3.5 h-3.5" />
                        {isUrdu ? 'رابطہ نمبر (فون) *' : 'Phone / Contact Number *'}
                    </label>
                    <Input 
                        type="tel"
                        placeholder={isUrdu ? 'مثال: 03001234567' : 'e.g. 03001234567'}
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className={cn(
                            "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                            errors.phone && "border-red-500"
                        )}
                    />
                    {errors.phone && (
                        <p className="text-[11px] font-bold text-red-500">{errors.phone}</p>
                    )}
                </div>

                {/* Country */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <Globe className="w-3.5 h-3.5" />
                        {isUrdu ? 'ملک' : 'Country'}
                    </label>
                    <Input 
                        type="text"
                        placeholder={isUrdu ? 'مثال: پاکستان' : 'e.g. Pakistan'}
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        className="h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40"
                    />
                    {errors.country && (
                        <p className="text-[11px] font-bold text-red-500">{errors.country}</p>
                    )}
                </div>

                {/* Address */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                        <MapPin className="w-3.5 h-3.5" />
                        {isUrdu ? 'مکمل پتہ *' : 'Residential Address *'}
                    </label>
                    <textarea 
                        rows={3}
                        placeholder={isUrdu ? 'اپنا مکمل گھر کا پتہ درج کریں' : 'Enter your full residential address'}
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className={cn(
                            "w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                            errors.address && "border-red-500 dark:border-red-500",
                            isUrdu && "text-right font-urdu"
                        )}
                    />
                    {errors.address && (
                        <p className="text-[11px] font-bold text-red-500">{errors.address}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
