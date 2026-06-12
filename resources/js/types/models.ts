// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PageMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface PageLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface Paginated<T> {
    data: T[];
    meta: PageMeta;
    links: PageLinks;
}

// ─── Auth & RBAC ─────────────────────────────────────────────────────────────

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

export interface Role {
    created_at: string | number | Date;
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
}

// ─── User & Admissions ───────────────────────────────────────────────────────

export interface UserDetail {
    id: number;
    user_id: number;
    class_id: number;
    registration_no: string | null;
    guardian_name: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    id_card_no: string;
    qualification: string;
    phone: string;
    country: string | null;
    admission_type: string | null;
    is_approved: boolean;
    class?: Klass;
    user?: User;
    dob?: string | null;
    birth_certificate_path?: string | null;
    education_degree_path?: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    status: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: string[];
    permissions: string[];
    user_detail?: UserDetail;
    // from UserResource
    registration_no?: string | null;
    is_approved?: boolean;
    class?: Klass | null;
}

export interface LogAdmissionClass {
    id: number;
    student_id: number;
    user_id: number | null;
    class_id: number;
    note: string | null;
    created_at: string;
    admin?: Pick<User, 'id' | 'name'>;
    class?: Klass;
}

// ─── Classification ───────────────────────────────────────────────────────────

export interface Speaker {
    id: number;
    name: string;
    short_name: string | null;
    status: boolean;
    image: string | null;
    image_url?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Category {
    id: number;
    name: string;
    type: 'audio' | 'video' | 'download';
    slug: string | null;
    status: boolean;
}

export interface Year {
    id: number;
    name: number; // actual year number e.g. 2023
    status: boolean;
}

// ─── Media Content ────────────────────────────────────────────────────────────

export interface Audio {
    id: number;
    title: string;
    slug: string;
    user_title: string | null;
    uri?: string;
    url?: string;
    youtube_url: string | null;
    description: string | null;
    views: number;
    thumbnail_uri: string | null;
    publish_date: string | null;
    status: boolean;
    tags: string[];
    media?: {
        speaker?: Speaker | null;
        category?: Category | null;
        year?: Year | null;
    } | null;
    speaker?: Speaker | null;
    category?: Category | null;
    year?: Year | null;
    created_at: string;
    updated_at: string;
}

export interface Video {
    id: number;
    title: string;
    slug: string;
    urdu_title: string | null;
    url?: string;
    uri?: string;
    youtube_url: string | null;
    description: string | null;
    views: number;
    watch_time?: number;
    duration?: number | string | null;
    file_size?: number | null;
    width?: number | null;
    height?: number | null;
    thumbnail_uri: string | null;
    status: boolean;
    tags: string[];
    media?: {
        speaker?: Speaker | null;
        category?: Category | null;
        year?: Year | null;
    } | null;
    speaker?: Speaker | null;
    category?: Category | null;
    year?: Year | null;
    meta_title?: string | null;
    meta_description?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Image {
    id: number;
    title: string | null;
    uri: string;
    description: string | null;
    btn_title: string | null;
    btn_link: string | null;
    weight: number | null;
    parent_id: number | null;
    status: boolean;
    category?: string | null;
    created_at: string;
    updated_at: string;
}

// ─── Dars-e-Nizami ────────────────────────────────────────────────────────────

export interface Klass {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    live_link: string | null;
    youtube_live_link: string | null;
    sort: number | null;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface Teacher {
    id: number;
    name: string;
    urdu_name: string;
    status: boolean;
}

export interface Book {
    id: number;
    name: string;
    urdu_name: string;
    status: boolean;
}

export interface Department {
    id: number;
    slug: string;
    name: string;
    name_urdu: string | null;
    description: string | null;
    description_urdu: string | null;
    icon_name: string | null;
    sort_order: number | null;
    status: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ClassSession {

    id: number;
    class_id: number;
    teacher_id: number;
    book_id: number;
    year_id: number;
    lecture_link: string | null;
    created_by: number | null;
    status: boolean;
    class?: Klass;
    teacher?: Teacher;
    book?: Book;
    year?: Year;
}

// ─── Q&A / Fatawa ────────────────────────────────────────────────────────────

export interface Topic {
    id: number;
    title: string;
    status: boolean;
}

export interface QuestionAnswer {
    id: number;
    topic_id: number;
    title: string;
    question: string;
    answer: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    topic?: Topic;
}

// ─── CMS & Settings ───────────────────────────────────────────────────────────

export interface PrayerTiming {
    id: number;
    name: string;
    urdu_name: string | null;
    time: string; // HH:MM:SS
}

export interface LatestNews {
    id: number;
    text: string;
    slug?: string;
    image_uri?: string | null;
    excerpt?: string | null;
    content?: string | null;
    link: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface Setting {
    key: string;
    value: string;
}

// ─── Downloads & Subscriptions ────────────────────────────────────────────────

export interface DownloadLink {
    id: number;
    title: string;
    description: string | null;
    category_id: number | null;
    year_id: number | null;
    url: string;
    file_size: string | null;
    status: boolean;
    sort_order: number | null;
    category?: Category;
    year?: Year;
    created_at?: string;
    updated_at?: string;
}

export interface UserSubscription {
    id: number;
    user_id: number;
    phone: string | null;
    country: string;
    created_at: string;
    user?: Pick<User, 'id' | 'name' | 'email'>;
}

// ─── Feedback ────────────────────────────────────────────────────────────────

export interface Feedback {
    id: number;
    name: string;
    email: string;
    country: string;
    comment: string | null;
    rating: number;
    phone: string | null;
    created_at: string;
}

// ─── Push Notifications ──────────────────────────────────────────────────────

export interface DeviceToken {
    id: number;
    user_id: number;
    token: string;
    platform: 'android' | 'ios';
    created_at: string;
}

export interface PushNotification {
    id: number;
    title: string;
    body: string;
    target: 'all' | 'role' | 'user';
    sent_at: string;
}

export interface AppNotification {
    id: number;
    user_id: number;
    title: string;
    body: string;
    data: any;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
    audio_count: number;
    video_count: number;
    image_count: number;
    audio_views: number;
    video_views: number;
    admissions_total: number;
    admissions_pending: number;
    admissions_approved: number;
    feedback_count: number;
    feedback_avg_rating: number;
    rating_breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}
