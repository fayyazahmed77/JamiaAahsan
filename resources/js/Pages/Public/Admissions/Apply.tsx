import React, { useState } from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { usePage, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Klass } from '@/types/models';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Lock, ArrowLeft, ArrowRight, 
    Send, AlertCircle, FileSpreadsheet 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';

// Step components
import StepIndicator from './components/StepIndicator';
import PersonalInfoStep from './components/PersonalInfoStep';
import AcademicInfoStep from './components/AcademicInfoStep';
import DocumentsStep from './components/DocumentsStep';
import ReviewStep from './components/ReviewStep';

interface AdmissionsApplyProps {
    classes: Klass[];
}

export default function Apply({ classes }: AdmissionsApplyProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const [currentStep, setCurrentStep] = useState(1);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    const steps = [
        { title: 'Account', urduTitle: 'اکاؤنٹ' },
        { title: 'Personal', urduTitle: 'ذاتی معلومات' },
        { title: 'Academics', urduTitle: 'تعلیمی معلومات' },
        { title: 'Review & Submit', urduTitle: 'جائزہ اور دستاویزات' }
    ];

    // Form Hook
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        class_id: '',
        guardian_name: '',
        gender: '',
        dob: '',
        id_card_no: '',
        phone: '',
        address: '',
        country: 'Pakistan',
        admission_type: 'regular',
        qualification: '',
        birth_certificate: null as File | null,
        education_degree: null as File | null,
    });

    // Client-side validations for each step
    const validateStep = (step: number): boolean => {
        const errorsList: Record<string, string> = {};
        
        if (step === 1) {
            if (!data.name.trim()) errorsList.name = isUrdu ? 'نام درج کرنا لازمی ہے۔' : 'Name is required.';
            if (!data.email.trim()) {
                errorsList.email = isUrdu ? 'ای میل درج کرنا لازمی ہے۔' : 'Email is required.';
            } else if (!/\S+@\S+\.\S+/.test(data.email)) {
                errorsList.email = isUrdu ? 'درست ای میل درج کریں۔' : 'Invalid email format.';
            }
            if (!data.password) {
                errorsList.password = isUrdu ? 'پاس ورڈ درج کرنا لازمی ہے۔' : 'Password is required.';
            } else if (data.password.length < 8) {
                errorsList.password = isUrdu ? 'پاس ورڈ کم از کم ۸ حروف کا ہونا چاہئے۔' : 'Password must be at least 8 characters.';
            }
            if (data.password !== data.password_confirmation) {
                errorsList.password_confirmation = isUrdu ? 'پاس ورڈ کی تصدیق مماثل نہیں ہے۔' : 'Password confirmation does not match.';
            }
        }
        
        if (step === 2) {
            if (!data.gender) errorsList.gender = isUrdu ? 'جنس کا انتخاب لازمی ہے۔' : 'Gender is required.';
            if (!data.dob) errorsList.dob = isUrdu ? 'تاریخِ پیدائش لازمی ہے۔' : 'Date of birth is required.';
            if (!data.id_card_no.trim()) errorsList.id_card_no = isUrdu ? 'شناختی کارڈ یا ب-فارم نمبر لازمی ہے۔' : 'ID card / B-Form is required.';
            if (!data.phone.trim()) errorsList.phone = isUrdu ? 'رابطہ نمبر درج کرنا لازمی ہے۔' : 'Phone number is required.';
            if (!data.address.trim()) errorsList.address = isUrdu ? 'پتہ درج کرنا لازمی ہے۔' : 'Address is required.';
        }
        
        if (step === 3) {
            if (!data.class_id) errorsList.class_id = isUrdu ? 'کلاس یا تعلیمی کورس کا انتخاب لازمی ہے۔' : 'Program selection is required.';
            if (!data.guardian_name.trim()) errorsList.guardian_name = isUrdu ? 'والد یا سرپرست کا نام لازمی ہے۔' : 'Guardian name is required.';
            if (!data.qualification.trim()) errorsList.qualification = isUrdu ? 'سابقہ تعلیمی قابلیت لازمی ہے۔' : 'Previous qualification is required.';
        }

        setLocalErrors(errorsList);
        return Object.keys(errorsList).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
            window.scrollTo({ top: 200, behavior: 'smooth' });
        } else {
            toast.error(isUrdu ? 'برائے مہربانی پہلے مرحلے کی خامیاں درست کریں۔' : 'Please fix the errors before moving to the next step.');
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (currentStep < steps.length) {
            nextStep();
            return;
        }
        
        if (!validateStep(3)) {
            setCurrentStep(3);
            return;
        }

        // Send multi-step form data using Inertia post (handling file uploads requires multipart form data)
        post('/admissions/apply', {
            forceFormData: true,
            onSuccess: () => {
                toast.success(isUrdu ? 'داخلہ درخواست کامیابی سے موصول ہو گئی!' : 'Your admission application has been submitted successfully!');
            },
            onError: (err) => {
                toast.error(isUrdu ? 'درخواست جمع کرنے میں کچھ خامی پیش آئی ہے۔' : 'An error occurred during submission. Please check the fields.');
                // Map backend errors back to step redirects if possible
                if (err.email || err.password || err.name) {
                    setCurrentStep(1);
                } else if (err.gender || err.dob || err.id_card_no || err.phone || err.address) {
                    setCurrentStep(2);
                } else if (err.class_id || err.guardian_name || err.qualification) {
                    setCurrentStep(3);
                } else if (err.birth_certificate || err.education_degree) {
                    setCurrentStep(4);
                }
            }
        });
    };

    const mergedErrors = { ...localErrors, ...errors };

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'آن لائن داخلہ فارم' : 'Apply Online for Admissions'} 
                description={isUrdu ? 'جامعہ احسن میں نئے تعلیمی سال کے لیے آن لائن داخلہ فارم پُر کریں اور اپنے اسناد اپلوڈ کریں۔' : 'Fill out the online admission application form for classical Islamic courses at Jamia Ahsan.'}
            />

            {/* Sub-Header Banner */}
            <div className="relative bg-sapphire-950 py-16 md:py-20 text-white overflow-hidden shadow-md">
                <div className="absolute inset-0 pointer-events-none">
                    <img 
                        src="/images/video-page-bg.png" 
                        alt="" 
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-black/25" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-widest font-black text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-3">
                        {isUrdu ? 'داخلہ رجسٹریشن' : 'Admissions Apply'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'آن لائن داخلہ فارم' : 'Online Admission Application'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'برائے مہربانی نیچے دیے گئے فارم کو چار مراحل میں مکمل اور درست معلومات کے ساتھ پُر کریں۔' 
                            : 'Please fill out the step-by-step form below to complete your admissions application.'
                        }
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 md:p-10 shadow-md">
                    
                    {/* Step indicator */}
                    <StepIndicator currentStep={currentStep} steps={steps} isUrdu={isUrdu} />

                    <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                        
                        {/* Animated Step contents */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Step 1: Account Creation */}
                                {currentStep === 1 && (
                                    <div className="space-y-5">
                                        <h2 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                                            {isUrdu ? '۱. اکاؤنٹ کی معلومات' : '1. Create Application Account'}
                                        </h2>
                                        <p className={cn("text-xs text-stone-500 leading-relaxed mb-4", isUrdu && "font-urdu")}>
                                            {isUrdu 
                                                ? 'درخواست کا اسٹیٹس چیک کرنے اور لاگ ان کرنے کے لیے اکاؤنٹ معلومات درج کریں۔' 
                                                : 'Please create an account to track your admission application status and access materials.'
                                            }
                                        </p>

                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1.5", isUrdu && "font-urdu text-[9px]")}>
                                                <User className="w-3.5 h-3.5" />
                                                {isUrdu ? 'مکمل نام *' : 'Applicant Full Name *'}
                                            </label>
                                            <Input 
                                                type="text"
                                                placeholder={isUrdu ? 'اپنا مکمل نام درج کریں' : 'Enter your full name'}
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                autoComplete="name"
                                                className={cn(
                                                    "h-10.5 rounded-xl border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                                                    mergedErrors.name && "border-red-500"
                                                )}
                                            />
                                            {mergedErrors.name && (
                                                <p className="text-[11px] font-bold text-red-500">{mergedErrors.name}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1.5", isUrdu && "font-urdu text-[9px]")}>
                                                <Mail className="w-3.5 h-3.5" />
                                                {isUrdu ? 'ای میل ایڈریس *' : 'Email Address *'}
                                            </label>
                                            <Input 
                                                type="email"
                                                placeholder={isUrdu ? 'اپنا کارآمد ای میل درج کریں' : 'Enter email address'}
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                autoComplete="email"
                                                className={cn(
                                                    "h-10.5 rounded-xl border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                                                    mergedErrors.email && "border-red-500"
                                                )}
                                            />
                                            {mergedErrors.email && (
                                                <p className="text-[11px] font-bold text-red-500">{mergedErrors.email}</p>
                                            )}
                                        </div>

                                        {/* Password & Confirm */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1.5", isUrdu && "font-urdu text-[9px]")}>
                                                    <Lock className="w-3.5 h-3.5" />
                                                    {isUrdu ? 'پاس ورڈ *' : 'Create Password *'}
                                                </label>
                                                <Input 
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    autoComplete="new-password"
                                                    className={cn(
                                                        "h-10.5 rounded-xl border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                                                        mergedErrors.password && "border-red-500"
                                                    )}
                                                />
                                                {mergedErrors.password && (
                                                    <p className="text-[11px] font-bold text-red-500">{mergedErrors.password}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1.5", isUrdu && "font-urdu text-[9px]")}>
                                                    <Lock className="w-3.5 h-3.5" />
                                                    {isUrdu ? 'پاس ورڈ کی تصدیق *' : 'Confirm Password *'}
                                                </label>
                                                <Input 
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    autoComplete="new-password"
                                                    className={cn(
                                                        "h-10.5 rounded-xl border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                                                        mergedErrors.password_confirmation && "border-red-500"
                                                    )}
                                                />
                                                {mergedErrors.password_confirmation && (
                                                    <p className="text-[11px] font-bold text-red-500">{mergedErrors.password_confirmation}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Personal Information */}
                                {currentStep === 2 && (
                                    <div className="space-y-5">
                                        <h2 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                                            {isUrdu ? '۲. ذاتی معلومات' : '2. Personal Information'}
                                        </h2>
                                        <PersonalInfoStep 
                                            data={data} 
                                            setData={setData} 
                                            errors={mergedErrors} 
                                            isUrdu={isUrdu} 
                                        />
                                    </div>
                                )}

                                {/* Step 3: Academic Information */}
                                {currentStep === 3 && (
                                    <div className="space-y-5">
                                        <h2 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                                            {isUrdu ? '۳. تعلیمی ترجیحات اور سرپرست' : '3. Academic Preferences & Background'}
                                        </h2>
                                        <AcademicInfoStep 
                                            data={data} 
                                            setData={setData} 
                                            errors={mergedErrors} 
                                            classes={classes} 
                                            isUrdu={isUrdu} 
                                        />
                                    </div>
                                )}

                                {/* Step 4: Documents Upload & Review */}
                                {currentStep === 4 && (
                                    <div className="space-y-8">
                                        <div className="space-y-5">
                                            <h2 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                                                {isUrdu ? '۴. دستاویزات اپلوڈ کریں' : '4. Scanned Document Uploads'}
                                            </h2>
                                            <DocumentsStep 
                                                data={data} 
                                                setData={setData} 
                                                errors={mergedErrors} 
                                                isUrdu={isUrdu} 
                                            />
                                        </div>

                                        <div className="space-y-5 border-t border-stone-200 dark:border-stone-800 pt-8">
                                            <h2 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                                                {isUrdu ? 'درخواست کا حتمی جائزہ' : 'Review Your Details'}
                                            </h2>
                                            <ReviewStep 
                                                data={data} 
                                                classes={classes} 
                                                isUrdu={isUrdu} 
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Control buttons */}
                        <div className="flex justify-between items-center pt-6 border-t border-stone-100 dark:border-stone-800">
                            {/* Previous Button */}
                            {currentStep > 1 ? (
                                <Button
                                    key="prev-btn"
                                    type="button"
                                    onClick={prevStep}
                                    variant="outline"
                                    className={cn(
                                        "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 font-bold",
                                        isUrdu && "font-urdu flex-row-reverse"
                                    )}
                                >
                                    {isUrdu ? <ArrowRight className="w-4 h-4 ml-1.5" /> : <ArrowLeft className="w-4 h-4 mr-1.5" />}
                                    <span>{isUrdu ? 'پچھلا مرحلہ' : 'Back'}</span>
                                </Button>
                            ) : (
                                <div />
                            )}

                            {/* Next or Submit Button */}
                            {currentStep < steps.length ? (
                                <Button
                                    key="next-btn"
                                    type="button"
                                    onClick={nextStep}
                                    className={cn(
                                        "h-10.5 rounded-xl bg-sapphire-600 hover:bg-sapphire-700 text-white dark:bg-sapphire-500 font-bold px-6",
                                        isUrdu && "font-urdu flex-row-reverse"
                                    )}
                                >
                                    <span>{isUrdu ? 'اگلا مرحلہ' : 'Next Step'}</span>
                                    {isUrdu ? <ArrowLeft className="w-4 h-4 mr-1.5" /> : <ArrowRight className="w-4 h-4 ml-1.5" />}
                                </Button>
                            ) : (
                                <Button
                                    key="submit-btn"
                                    type="submit"
                                    disabled={processing}
                                    className={cn(
                                        "h-10.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 flex items-center gap-2",
                                        isUrdu && "font-urdu flex-row-reverse"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{isUrdu ? 'درخواست جمع کریں' : 'Submit Application'}</span>
                                </Button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

Apply.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
