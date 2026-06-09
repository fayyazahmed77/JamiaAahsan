import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import { Select } from '@/Components/ui/Select';
import { Button } from '@/Components/ui/Button';
import { Alert } from '@/Components/ui/Alert';
import { 
    User, Mail, Phone, Globe, Briefcase, Globe2, Save, X, Trash2, Camera
} from 'lucide-react';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

const Linkedin = ({ size = 16, ...props }: CustomIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const Facebook = ({ size = 16, ...props }: CustomIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const Instagram = ({ size = 16, ...props }: CustomIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const Twitter = ({ size = 16, ...props }: CustomIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

interface DepartmentItem {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    departments: DepartmentItem[];
    status?: string;
}

export default function Edit({ departments = [], status }: Props) {
    const { auth, flash } = usePage<any>().props;
    const user = auth.user?.data || auth.user || {};

    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        job_title: user.job_title || '',
        department: user.department || '',
        bio: user.bio || '',
        linkedin_url: user.linkedin_url || '',
        facebook_url: user.facebook_url || '',
        instagram_url: user.instagram_url || '',
        twitter_url: user.twitter_url || '',
        portfolio_url: user.portfolio_url || '',
        password: '',
        password_confirmation: '',
        profile_image: null as File | null,
        remove_profile_image: false,
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(user.profile_image_url || null);

    // Common country options
    const countryOptions = [
        { value: 'Pakistan', label: 'Pakistan' },
        { value: 'Germany', label: 'Germany' },
        { value: 'Saudi Arabia', label: 'Saudi Arabia' },
        { value: 'United Arab Emirates', label: 'United Arab Emirates' },
        { value: 'United Kingdom', label: 'United Kingdom' },
        { value: 'United States', label: 'United States' },
        { value: 'Turkey', label: 'Turkey' },
        { value: 'Canada', label: 'Canada' },
    ];

    // Department options mapped from backend prop
    const departmentOptions = departments.map((d: DepartmentItem) => ({
        value: d.name,
        label: d.name,
    }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                profile_image: file,
                remove_profile_image: false,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({
            ...prev,
            profile_image: null,
            remove_profile_image: true,
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/profile', {
            forceFormData: true,
            onSuccess: () => {
                reset('password', 'password_confirmation');
            }
        });
    };

    return (
        <AdminLayout title="Profile Settings">
            <Head title="Account Settings" />

            <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
                
                {/* Status messages */}
                {(status || flash?.success) && (
                    <Alert variant="success" dismissible className="shadow-xs">
                        {status || flash?.success}
                    </Alert>
                )}
                {flash?.error && (
                    <Alert variant="danger" dismissible className="shadow-xs">
                        {flash?.error}
                    </Alert>
                )}

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6 items-start" noValidate>
                    
                    {/* LEFT COLUMN: Profile Image Card */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <div className="card shadow-sm p-6 flex flex-col items-center text-center">
                            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4 w-full text-left border-b border-[var(--border)] pb-2">
                                Profile Image
                            </h3>

                            {/* Circle Avatar Frame */}
                            <div className="relative group w-36 h-36 mb-4">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Profile Preview" 
                                        className="w-full h-full object-cover rounded-full border-2 border-emerald-500/20 shadow-md"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center text-4xl font-bold border-2 border-primary-500/20 shadow-md select-none">
                                        {(user.name?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}

                                {/* Remove Image red cross button overlay */}
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer border-2 border-white dark:border-stone-900"
                                        title="Remove Photo"
                                    >
                                        <X size={14} className="stroke-[3px]" />
                                    </button>
                                )}
                            </div>

                            {/* Hidden Image Input */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />

                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={triggerFileSelect}
                                className="flex items-center gap-1.5 cursor-pointer font-medium"
                            >
                                <Camera size={14} />
                                Upload Image
                            </Button>
                            
                            {errors.profile_image && (
                                <p className="text-xs text-destructive mt-2">{errors.profile_image}</p>
                            )}

                            <div className="mt-4 text-xs text-[var(--text-muted)] w-full text-left border-t border-[var(--border)] pt-4 leading-relaxed">
                                <p className="font-semibold text-[var(--text-secondary)] mb-1">Upload guidelines:</p>
                                <p>• Supports JPG, PNG, GIF formats.</p>
                                <p>• Maximum file size is 2MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Profile Input Forms */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        
                        {/* Section 1: Basic Information & Login Credentials */}
                        <div className="card shadow-sm p-6">
                            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2">
                                Basic Information and Login Credentials
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="name"
                                    type="text"
                                    label="Full Name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={errors.name}
                                    required
                                    icon={<User size={16} />}
                                />
                                
                                <Input
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                    icon={<Mail size={16} />}
                                />

                                <Input
                                    id="phone"
                                    type="text"
                                    label="Phone Number"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    error={errors.phone}
                                    placeholder="e.g. 034669039724"
                                    icon={<Phone size={16} />}
                                />

                                <Select
                                    id="country"
                                    label="Country"
                                    value={data.country}
                                    onChange={e => setData('country', e.target.value)}
                                    error={errors.country}
                                    placeholder="Select Country"
                                    options={countryOptions}
                                />

                                <Input
                                    id="password"
                                    type="password"
                                    label="Password (Leave blank to keep current)"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    error={errors.password}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />

                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    label="Confirm Password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        {/* Section 2: Additional Information */}
                        <div className="card shadow-sm p-6">
                            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2">
                                Additional Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    id="job_title"
                                    type="text"
                                    label="Job Title"
                                    value={data.job_title}
                                    onChange={e => setData('job_title', e.target.value)}
                                    error={errors.job_title}
                                    placeholder="e.g. Country Manager"
                                    icon={<Briefcase size={16} />}
                                />

                                <Select
                                    id="department"
                                    label="Career Site Department"
                                    value={data.department}
                                    onChange={e => setData('department', e.target.value)}
                                    error={errors.department}
                                    placeholder="Select Department"
                                    options={departmentOptions}
                                />
                            </div>

                            <Textarea
                                id="bio"
                                label="Bio"
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                error={errors.bio}
                                placeholder="Short biography..."
                                rows={4}
                            />
                        </div>

                        {/* Section 3: Social Profiles */}
                        <div className="card shadow-sm p-6">
                            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2">
                                Social Profiles
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    id="linkedin_url"
                                    type="url"
                                    label="LinkedIn URL"
                                    value={data.linkedin_url}
                                    onChange={e => setData('linkedin_url', e.target.value)}
                                    error={errors.linkedin_url}
                                    placeholder="https://linkedin.com/in/..."
                                    icon={<Linkedin size={16} />}
                                />

                                <Input
                                    id="facebook_url"
                                    type="url"
                                    label="Facebook URL"
                                    value={data.facebook_url}
                                    onChange={e => setData('facebook_url', e.target.value)}
                                    error={errors.facebook_url}
                                    placeholder="https://facebook.com/..."
                                    icon={<Facebook size={16} />}
                                />

                                <Input
                                    id="instagram_url"
                                    type="url"
                                    label="Instagram URL"
                                    value={data.instagram_url}
                                    onChange={e => setData('instagram_url', e.target.value)}
                                    error={errors.instagram_url}
                                    placeholder="https://instagram.com/..."
                                    icon={<Instagram size={16} />}
                                />

                                <Input
                                    id="twitter_url"
                                    type="url"
                                    label="X (Twitter) URL"
                                    value={data.twitter_url}
                                    onChange={e => setData('twitter_url', e.target.value)}
                                    error={errors.twitter_url}
                                    placeholder="https://x.com/..."
                                    icon={<Twitter size={16} />}
                                />
                            </div>

                            <div className="mt-4">
                                <Input
                                    id="portfolio_url"
                                    type="url"
                                    label="Other Profile URL"
                                    value={data.portfolio_url}
                                    onChange={e => setData('portfolio_url', e.target.value)}
                                    error={errors.portfolio_url}
                                    placeholder="https://portfolio.com..."
                                    icon={<Globe2 size={16} />}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={processing}
                                className="flex items-center gap-2 font-bold cursor-pointer min-w-44"
                            >
                                <Save size={16} />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
