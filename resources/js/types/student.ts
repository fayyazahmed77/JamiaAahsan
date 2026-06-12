// Student Portal Type Definitions

export interface StudentUser {
    id: number;
    student_id_number: string;
    name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender: 'male' | 'female';
    student_type: 'online' | 'onsite';
    status: 'pending' | 'active' | 'inactive' | 'graduated' | 'withdrawn' | 'suspended';
    profile_photo_url?: string | null;
    current_year: number;
    current_semester: number;
    program_id?: number | null;
    current_semester_id?: number | null;
    enrollment_date?: string;
    program?: string;
    program_ur?: string;
    batch?: string;
    progress_percentage?: number;
    expected_graduation?: string;
    student_type_label?: string;
    digital_id?: DigitalIdCard | null;
}

export interface StudentProfile {
    id?: number;
    student_id?: number;
    father_name?: string;
    mother_name?: string;
    nationality?: string;
    mother_tongue?: string;
    national_id?: string;
    address?: string;
    city?: string;
    province?: string;
    country?: string;
    previous_madrasa?: string;
    previous_qualification?: string;
    hifz_status?: 'non_hafiz' | 'in_progress' | 'hafiz';
    maslak?: string;
    specialization_interests?: string[];
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relation?: string;
}

export interface StudentGuardian {
    id: number;
    student_id: number;
    name: string;
    relation: 'father' | 'mother' | 'brother' | 'uncle' | 'grandfather' | 'other';
    phone?: string;
    email?: string;
    cnic?: string;
    address?: string;
    occupation?: string;
    is_primary: boolean;
}

export interface StudentSettings {
    id?: number;
    language: 'en' | 'ur';
    theme: 'light' | 'dark' | 'system';
    notify_assignment: boolean;
    notify_exam: boolean;
    notify_result: boolean;
    notify_attendance: boolean;
    notify_notice: boolean;
    notify_hifz: boolean;
    notify_support: boolean;
    notify_certificate: boolean;
    notify_teacher: boolean;
    two_factor_enabled: boolean;
    login_notifications: boolean;
}

export interface DigitalIdCard {
    card_number: string;
    qr_code_url?: string | null;
    pdf_url?: string | null;
    issued_at?: string;
    valid_until?: string;
    is_active: boolean;
}

export interface IslamicVerse {
    arabic_text?: string;
    translation_en?: string;
    translation_ur?: string;
    reference?: string;
}

export interface IslamicHadith {
    text_en?: string;
    text_ur?: string;
    source?: string;
    grade?: string;
}

export interface IslamicContent {
    verse?: IslamicVerse | null;
    hadith?: IslamicHadith | null;
    reminder?: string | null;
}

export interface JourneyStats {
    program?: string;
    program_ur?: string;
    current_year: number;
    current_semester: number;
    total_semesters: number;
    progress_percentage: number;
    expected_graduation?: string;
    student_type_label?: string;
    enrollment_date?: string;
}

export interface DashboardAlert {
    type: 'warning' | 'error' | 'info' | 'success';
    icon: string;
    message: string;
    action_url?: string;
}

export interface AttendanceSummary {
    total: number;
    present: number;
    absent: number;
    leave: number;
    rate: number;
}

export interface StudentNotification {
    id: number;
    title: string;
    title_ur?: string;
    message: string;
    message_ur?: string;
    type: string;
    action_url?: string;
    is_read: boolean;
    read_at?: string;
    created_at: string;
}

export interface LoginHistoryEntry {
    ip_address?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    status: 'success' | 'failed';
    logged_in_at?: string;
}

// Shared data for Student Portal pages
export interface StudentSharedData {
    student: StudentUser;
    unread_count: number;
    locale: 'en' | 'ur';
    dir: 'ltr' | 'rtl';
    flash: {
        success?: string;
        error?: string;
    };
}
