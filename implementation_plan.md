# 🕌 Islamic Institute Platform — FINALIZED Modernization Plan

> **Decisions Locked In:**
> - ✅ Admin: **Inertia.js** (shared Laravel auth, no separate API needed)
> - ✅ File Storage: **Local server** (Laravel `local` disk, configurable path)
> - ✅ RTL: **Full RTL toggle** (Arabic/Urdu ↔ English site-wide switch)
> - ✅ Mobile extras: **Push Notifications + Offline Audio + In-App Live Streaming**

---

## 🗃️ COMPLETE DATABASE SCHEMA (Final State — All 50 Migrations Applied)

### AUTH & RBAC MODULE

```
users                    → id, name, email, email_verified_at, password, remember_token,
                           status(tinyint:1), deleted_at, timestamps

roles                    → id, name, slug, description, level(int:1), timestamps, deleted_at
permissions              → id, name, slug(unique), description, model, timestamps, deleted_at
role_user                → id, role_id→roles, user_id→users, timestamps, deleted_at
permission_role          → id, permission_id→permissions, role_id→roles, timestamps, deleted_at
permission_user          → id, permission_id→permissions, user_id→users, timestamps, deleted_at
password_resets          → email, token, created_at
failed_jobs              → id, connection, queue, payload, exception, failed_at
```

**Active Permission Slugs** (from route middleware):
`view/create/edit/delete` × `users, roles, speakers, years, categories, audio, videos,
settings, pages, home.main.banner, feedback`

---

### MEDIA CONTENT MODULE

```
audio                    → id, title, user_title(nullable), uri, youtube_url(nullable),
                           description(longText nullable), views(int:0), thumbnail_uri(nullable),
                           publish_date(datetime nullable), status(tinyint:1), deleted_at, timestamps

videos                   → id, title, urdu_title(text nullable), uri, youtube_url(nullable),
                           description(longText nullable), views(int:0), thumbnail_uri(nullable),
                           status(tinyint:1), deleted_at, timestamps

images                   → id, title(nullable), uri, description(longText nullable),
                           btn_title(nullable), btn_link(nullable), weight(int nullable),
                           parent_id(bigint nullable→images self-ref), status(tinyint:1),
                           deleted_at, timestamps

media ★ CENTRAL HUB      → id, user_id→users, category_id→categories(nullable),
                           image_id→images(nullable), audio_id→audio(nullable),
                           video_id→videos(nullable), speaker_id→speakers(nullable),
                           year_id→years(nullable), uri, description(longText nullable),
                           type(enum:audio|video|image:audio), status(tinyint:1),
                           deleted_at, timestamps
```

**Relationship pattern:**
`Audio` → `hasOne(Media)` → `belongsTo(Speaker, Category, Year)`
All filtering/metadata is done through the `media` bridge table.

---

### CLASSIFICATION MODULE

```
speakers                 → id, name, short_name(nullable), status(tinyint:1), deleted_at, timestamps
categories               → id, name, type(string:'audio'|'video'), slug(nullable),
                           status(tinyint:1), deleted_at, timestamps
years                    → id, name(smallInt — actual year e.g. 2023), status(tinyint:1),
                           deleted_at, timestamps
tags                     → id, name(json), slug(json), type(nullable), order_column(nullable), timestamps
taggables                → tag_id→tags, taggable_id, taggable_type (polymorphic)
                           [used on Audio & Video for full-text search]
```

**Known category slugs:** `khitab-e-jummah`, `shab-e-jummah`, `home-main-banner`

---

### DARS-E-NIZAMI (ISLAMIC SCHOOL) MODULE

```
classes                  → id, name, slug, description(text nullable), live_link(nullable),
                           youtube_live_link(nullable), sort(int nullable),
                           status(tinyint:1), deleted_at, timestamps

class_sessions           → id, class_id→classes, teacher_id→teachers, book_id→books,
                           year_id→years, lecture_link(nullable), created_by(nullable),
                           status(tinyint:1), deleted_at, timestamps

teachers                 → id, name, urdu_name, status(tinyint:1), deleted_at, timestamps
books                    → id, name, urdu_name, status(tinyint:1), deleted_at, timestamps
```

---

### STUDENT ADMISSIONS MODULE

```
user_details             → id, user_id→users, class_id→classes, registration_no(unique nullable),
                           guardian_name, gender(enum:male|female|other:'male'),
                           address(text), id_card_no, qualification(text), phone,
                           country(nullable), admission_type(nullable), is_approved(tinyint:0),
                           timestamps

log_admission_classes    → id, student_id→users, user_id→users(nullable), class_id→classes,
                           note(text nullable), timestamps
```

---

### Q&A / FATAWA MODULE

```
topics                   → id, title(utf8_general_ci), status(tinyint:1), deleted_at, timestamps
question_answers         → id, topic_id→topics, title(utf8), question(text utf8),
                           answer(longText utf8), status(tinyint:1), deleted_at, timestamps
```

---

### CMS & SETTINGS MODULE

```
settings                 → id, [key-value structure], timestamps
prayer_timings           → id, name, urdu_name(nullable), time(TIME), timestamps
latest_news              → id, text, link(nullable), status(tinyint:1), deleted_at, timestamps
feedback                 → id, name, email, country, comment(longText nullable),
                           rating(smallInt:5), phone(nullable), deleted_at, timestamps
```

---

### DOWNLOADS & SUBSCRIPTIONS MODULE

```
download_links           → id, category_id→categories, year_id→years, url,
                           status(bool:1), deleted_at, timestamps

user_subscriptions       → id, user_id→users, phone(nullable), country, timestamps
```

---

## 🔌 CURRENT MOBILE API — Exact Response Shapes

### `GET /api/audio/latest` → Audio Resource
```json
{ "error": false, "data": { "records": [{ "iD": 1, "title": "...", "url": "...", "views": 42 }], "meta": {...} } }
```

### `GET /api/videos` → Video Resource
```json
{ "iD": 1, "title": "...", "url": "...", "thumbnailUri": "...", "views": 10 }
```

### `POST /api/login` → User Resource
```json
{ "iD": 1, "name": "Ahmed", "email": "...", "class": { "id":1, "name":"..." }, "token": "passport_token" }
```

> ⚠️ **Note:** Old API uses `iD` (camelCase with capital D) — new API will standardize to `id`. Mobile app must be updated alongside.

---

## 🚀 FULL EXECUTION PLAN — Phase by Phase

---

## PHASE 0 — Environment & Scaffold (Week 1)

### 0.1 New Laravel 13 Project
```bash
composer create-project laravel/laravel platform
cd platform
```

### 0.2 Core Packages to Install
```bash
# Auth
composer require laravel/sanctum
# (Sanctum handles BOTH cookie-based for Inertia/web AND token-based for React Native)

# RBAC (replacing jeremykenedy/laravel-roles)
composer require spatie/laravel-permission

# Tags (upgrade from v2 → v4)
composer require spatie/laravel-tags

# Inertia
composer require inertiajs/inertia-laravel
npm install @inertiajs/react

# React + TypeScript via Vite (built into Laravel 13)
npm install react react-dom @types/react @types/react-dom typescript

# Admin & Web UI
npm install @radix-ui/react-* lucide-react recharts
npm install @tanstack/react-table @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod

# RTL support
npm install @radix-ui/react-direction

# File handling
composer require intervention/image-laravel

# Excel import (keep from old project)
composer require maatwebsite/excel

# Push notifications
composer require laravel/firebase-notification-channel
# OR: composer require kutia-software-company/larafirebase

# Ziggy (named routes in React)
composer require tightenco/ziggy
npm install ziggy-js

# Countries (for dropdowns)
composer require pragmarx/countries
```

### 0.3 Database Strategy
```bash
# Point .env to OLD database — zero data loss
DB_CONNECTION=mysql
DB_DATABASE=old_db_name   # Same DB as old project

# Run only NEW migrations (additions only, no destructive changes)
php artisan migrate

# One-time seeder: migrate old jeremykenedy roles → Spatie format
php artisan db:seed --class=RolePermissionMigrationSeeder
```

### 0.4 Sanctum Setup (Replaces Passport)
- Configure `sanctum` for **stateful** (cookie, for Inertia website & admin)
- Configure `sanctum` for **token** (Bearer, for React Native app)
- Old Passport tokens: create `personal_access_tokens` table alongside existing `oauth_*` tables
- Mobile app will get new Sanctum tokens on first re-login

---

## PHASE 1 — Models, Services & API Foundation (Week 2)

### 1.1 Consolidated Migrations
Write **20 clean "create-if-not-exists" migrations** that describe the final schema.
Each uses `Schema::hasTable()` guard — safe to run against old DB.

New tables to add:
- `personal_access_tokens` (Sanctum)
- `notifications` (push notification log)
- `device_tokens` (FCM tokens for push notifications)

```php
// New table: device_tokens
Schema::create('device_tokens', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('token')->unique();
    $table->string('platform')->default('android'); // android | ios
    $table->timestamps();
});
```

### 1.2 Eloquent Models (21 models + 2 new)

All models rebuilt with:
- PHP 8.2 syntax (readonly properties, enums)
- `$fillable` arrays (no `$guarded = []`)
- Proper `$casts` (e.g., `'status' => 'boolean'`)
- Named relationships
- Scopes preserved from old models
- **`ActiveScope`** refactored as proper global scope class

**New models:**
- `DeviceToken` → FCM token per user/device
- `Notification` → Push notification log

### 1.3 Spatie Permission Migration
```php
// RolePermissionMigrationSeeder.php
// Reads from old jeremykenedy tables:
//   roles → spatie roles
//   permissions → spatie permissions  
//   role_user → model_has_roles
//   permission_role → role_has_permissions
//   permission_user → model_has_permissions
```

### 1.4 API v1 Routes (`routes/api.php`)

Full expanded API for React Native + future partners:

```php
Route::prefix('v1')->name('api.v1.')->group(function () {

    // ── Public ─────────────────────────────────────────────
    Route::prefix('audio')->group(function () {
        Route::get('/', [AudioController::class, 'index']);        // paginated, filterable
        Route::get('/latest', [AudioController::class, 'latest']);
        Route::get('/{id}', [AudioController::class, 'show']);
        Route::get('/categories/{cat}/years/{year}', [AudioController::class, 'byCategory']);
        Route::post('/{id}/mark-view', [AudioController::class, 'markView']);
    });

    Route::apiResource('videos', VideoController::class)->only(['index','show']);
    Route::post('videos/{id}/mark-view', [VideoController::class, 'markView']);

    Route::apiResource('categories', CategoryController::class)->only('index');
    Route::apiResource('years', YearController::class)->only('index');
    Route::apiResource('prayer-timings', PrayerTimingController::class)->only('index');
    Route::apiResource('images', ImageController::class)->only('index');
    Route::apiResource('downloads', DownloadController::class)->only('index');
    Route::apiResource('latest-news', LatestNewsController::class)->only('index');
    Route::apiResource('speakers', SpeakerController::class)->only('index');

    Route::apiResource('classes', ClassController::class)->only(['index','show']);
    Route::get('classes/{class}/sessions', [ClassSessionController::class, 'index']);

    Route::apiResource('topics', TopicController::class)->only('index');
    Route::apiResource('question-answers', QuestionAnswerController::class)->only(['index','show']);

    // ── Auth ───────────────────────────────────────────────
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);

    // ── Authenticated ──────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('user/profile', [UserController::class, 'profile']);
        Route::put('user/profile', [UserController::class, 'updateProfile']);

        Route::post('feedback', [FeedbackController::class, 'store']);
        Route::post('subscriptions', [SubscriptionController::class, 'store']);

        // Push notifications
        Route::post('device-tokens', [DeviceTokenController::class, 'store']);
        Route::delete('device-tokens', [DeviceTokenController::class, 'destroy']);
    });
});
```

### 1.5 API Resource Classes (JSON Transformers)

Standardized response format (fix `iD` → `id`):

```typescript
// All API responses:
{
  "data": { ... },       // single resource
  "data": [ ... ],       // collection
  "meta": { "current_page": 1, "per_page": 15, "total": 240 },
  "links": { "prev": null, "next": "..." }
}
```

New resource classes:
`AudioResource`, `VideoResource`, `CategoryResource`, `YearResource`,
`SpeakerResource`, `ClassResource`, `ClassSessionResource`, `TopicResource`,
`QuestionAnswerResource`, `PrayerTimingResource`, `DownloadResource`,
`LatestNewsResource`, `FeedbackResource`, `UserResource`, `ImageResource`

---

## PHASE 2 — Admin Panel (Inertia + React TypeScript) (Weeks 3–5)

### Tech Stack (Admin)
| Tool | Purpose |
|---|---|
| Inertia.js | Server-side routing, zero separate API |
| React 18 + TypeScript | Component framework |
| shadcn/ui (Radix) | Premium accessible component library |
| TanStack Table v8 | Advanced sortable/filterable data tables |
| React Hook Form + Zod | Type-safe form validation |
| Recharts | Analytics charts on dashboard |
| Tailwind CSS | Utility-first styling |
| `@radix-ui/react-direction` | RTL support in admin |

### 2.1 Admin Layout System

```
resources/js/admin/
├── Layouts/
│   ├── AdminLayout.tsx          # Sidebar + topbar shell
│   ├── AuthLayout.tsx           # Login page layout
│   └── components/
│       ├── Sidebar.tsx          # Navigation with permission-aware links
│       ├── Topbar.tsx           # User menu, notifications, RTL toggle
│       └── Breadcrumbs.tsx
├── Components/
│   ├── ui/                      # shadcn/ui re-exports
│   ├── DataTable.tsx            # TanStack Table wrapper
│   ├── FileUpload.tsx           # Drag & drop file upload → local storage
│   ├── RichTextEditor.tsx       # For pages/about content
│   ├── AudioPlayer.tsx          # Preview in admin
│   ├── ImageCropper.tsx         # Thumbnail cropping
│   └── ConfirmDialog.tsx
├── Pages/
│   ├── Dashboard/
│   │   └── Index.tsx            # Stats + charts + online users
│   ├── Auth/
│   │   └── Login.tsx
│   ├── Users/
│   │   ├── Index.tsx            # Table: name, email, role, status, online badge
│   │   ├── Create.tsx
│   │   └── Edit.tsx
│   ├── Roles/
│   │   ├── Index.tsx
│   │   └── Edit.tsx             # Permission matrix (checkbox grid)
│   ├── Speakers/
│   │   └── Index.tsx            # Inline CRUD
│   ├── Categories/
│   │   └── Index.tsx            # Name + type + slug
│   ├── Years/
│   │   └── Index.tsx
│   ├── Audio/
│   │   ├── Index.tsx            # Table with bulk actions
│   │   ├── Create.tsx           # URI/upload, youtube_url, category, speaker, year, tags, publish_date
│   │   ├── Edit.tsx
│   │   └── Import.tsx           # Excel bulk import
│   ├── Videos/
│   │   ├── Index.tsx
│   │   ├── Create.tsx           # + urdu_title field
│   │   ├── Edit.tsx
│   │   └── Import.tsx
│   ├── Images/
│   │   ├── Index.tsx            # Drag-to-reorder by weight
│   │   └── Form.tsx             # + btn_title, btn_link, parent_id
│   ├── Cms/
│   │   ├── Settings/Index.tsx   # Key-value editor
│   │   ├── Pages/Edit.tsx       # Rich text editor for static pages
│   │   ├── Banners/Index.tsx    # Home main banner CRUD + weight reorder
│   │   ├── PrayerTimings/Index.tsx # 5 prayers with Urdu names + time picker
│   │   └── LatestNews/Index.tsx # Ticker items CRUD
│   ├── Classes/
│   │   ├── Index.tsx            # + live badge (live_link/youtube_live_link)
│   │   └── Sessions/
│   │       ├── Index.tsx        # Sessions per class
│   │       └── Form.tsx         # teacher + book + year + lecture_link
│   ├── Teachers/ (Index, Form)
│   ├── Books/ (Index, Form)
│   ├── Admissions/
│   │   ├── Index.tsx            # Filter: gender, class, state(not-verified/verified/approved)
│   │   └── Show.tsx             # Full profile + audit log + approve btn + class transfer
│   ├── Downloads/ (Index, Form) # category + year + url
│   ├── Feedback/Index.tsx       # Star ratings breakdown chart
│   ├── Subscriptions/Index.tsx
│   ├── QuestionAnswers/
│   │   ├── Topics/Index.tsx
│   │   └── Index.tsx            # topic filter
│   └── Notifications/           # Push notification broadcast UI
└── types/
    ├── models.ts                # TypeScript interfaces mirroring all DB models
    └── inertia.ts               # Inertia shared data types
```

### 2.2 Admin Controllers (`app/Http/Controllers/Admin/`)
All return `Inertia::render('Admin/PageName', $props)`.
All use Spatie Permission middleware: `->middleware('permission:...')`.

### 2.3 Dashboard Widgets
```tsx
// Dashboard metrics from old DashboardController:
- Total audio / videos / images counts
- Audio views (sum) + Video views (sum)
- Admissions: total, pending, approved
- Feedback: count, avg rating (1–5), rating breakdown bar chart
- Latest 5 feedbacks
- Online users count (real-time)
- Quick links to common actions
```

### 2.4 File Upload (Local Storage)
```php
// config/filesystems.php
'disks' => [
    'media' => [
        'driver' => 'local',
        'root' => storage_path('app/public/media'),
        'url' => env('APP_URL').'/storage/media',
        'visibility' => 'public',
    ],
    'thumbnails' => [
        'driver' => 'local',
        'root' => storage_path('app/public/thumbnails'),
        'url' => env('APP_URL').'/storage/thumbnails',
    ],
]
// php artisan storage:link
```

---

## PHASE 3 — Public Website (Inertia + React TypeScript + RTL) (Weeks 6–8)

### Tech Stack (Website)
| Tool | Purpose |
|---|---|
| Inertia.js | Server-side pages, SSR-ready |
| React 18 + TypeScript | Component framework |
| `@radix-ui/react-direction` | RTL direction context |
| CSS Custom Properties | Design tokens, LTR/RTL-aware spacing |
| `react-h5-audio-player` | HTML5 audio player with RTL support |
| Framer Motion | Page transitions, animations |
| Google Fonts (Noto Nastaliq / Cairo) | Urdu + Arabic typography |

### 3.1 RTL Architecture

```tsx
// Inertia shared data includes locale direction
interface SharedData {
  auth: { user: User | null }
  locale: 'en' | 'ur'           // ← User's current language toggle
  dir: 'ltr' | 'rtl'           // ← Derived from locale
  prayerTimings: PrayerTiming[]
  latestNews: LatestNews[]
  flash: { success?: string; error?: string }
}

// Root layout:
<DirectionProvider dir={page.props.dir}>
  <html lang={locale} dir={dir}>
    <body className={dir === 'rtl' ? 'font-urdu' : 'font-sans'}>
      ...
    </body>
  </html>
</DirectionProvider>
```

CSS approach:
```css
/* Use logical properties throughout */
.card { padding-inline: 1.5rem; margin-inline-start: 1rem; }
/* RTL-aware flex direction via dir attribute */
[dir="rtl"] .nav-items { flex-direction: row-reverse; }
```

### 3.2 Website Pages

```
resources/js/web/
├── Layouts/
│   ├── MainLayout.tsx           # Header + footer + prayer time ticker + news ticker
│   └── AuthLayout.tsx           # Login/register layouts
├── Components/
│   ├── Header.tsx               # Nav + RTL toggle button + lang switcher
│   ├── Footer.tsx
│   ├── PrayerTimingBar.tsx      # Sticky bar with 5 prayer times (Urdu names in RTL)
│   ├── NewsTicker.tsx           # Marquee/scroll latest_news
│   ├── AudioCard.tsx            # Speaker, category badge, play button
│   ├── AudioPlayer.tsx          # Persistent bottom player (like Spotify)
│   ├── VideoCard.tsx            # Thumbnail + YouTube embed
│   ├── BannerSlider.tsx         # Hero slider from images table (weight-ordered)
│   ├── SearchBar.tsx            # Global search (audio, video, Q&A)
│   └── FeedbackForm.tsx         # Rating stars + country select
├── Pages/
│   ├── Home/Index.tsx           # Banners + Latest Bayanaat + Jummah + Videos + Prayer
│   ├── Audio/
│   │   ├── Index.tsx            # Filter: category, year, speaker, search
│   │   └── Show.tsx             # Player + details + tags + related
│   ├── Video/
│   │   ├── Index.tsx            # Video grid with filters
│   │   └── Show.tsx             # YouTube embed + details + related
│   ├── DarsENizami/
│   │   ├── Index.tsx            # Class cards with live badge
│   │   └── Show.tsx             # Class info + sessions list + join live button
│   ├── QuestionAnswer/
│   │   ├── Index.tsx            # Topic sidebar + Q&A accordion
│   │   └── Show.tsx             # Full Q&A detail
│   ├── Downloads/Index.tsx      # Grouped by category + year filter
│   ├── Pages/
│   │   ├── AboutUs.tsx
│   │   ├── ContactUs.tsx        # + feedback form
│   │   └── PrivacyPolicy.tsx
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx         # Full admission form
│   │   ├── ForgotPassword.tsx
│   │   └── VerifyEmail.tsx
│   └── Profile/Index.tsx        # Student: reg no., class, admission status
```

### 3.3 Design System (Islamic Aesthetic)

```css
/* Color palette — deep emerald + gold */
--color-primary: hsl(155, 65%, 25%);        /* Deep Islamic green */
--color-primary-light: hsl(155, 55%, 45%);
--color-accent: hsl(43, 85%, 52%);          /* Gold */
--color-surface: hsl(0, 0%, 8%);            /* Near-black (dark mode) */
--color-surface-elevated: hsl(0, 0%, 12%);
--color-text: hsl(0, 0%, 95%);
--color-text-muted: hsl(0, 0%, 60%);

/* Typography */
--font-latin: 'Inter', sans-serif;
--font-urdu: 'Noto Nastaliq Urdu', serif;   /* For Urdu content */
--font-arabic: 'Cairo', sans-serif;          /* For Arabic labels */

/* RTL-aware spacing */
--spacing-card: 1.5rem;
```

### 3.4 Inertia Shared Data (via `HandleInertiaRequests` middleware)
```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => ['user' => $request->user()],
        'locale' => session('locale', 'en'),
        'dir' => session('locale', 'en') === 'ur' ? 'rtl' : 'ltr',
        'prayerTimings' => PrayerTiming::all(),
        'latestNews' => LatestNews::active()->take(10)->get(),
        'flash' => [
            'success' => session('success'),
            'error' => session('error'),
        ],
    ]);
}
```

---

## PHASE 4 — React Native Mobile App (Weeks 9–11)

### Tech Stack (Mobile)
| Tool | Purpose |
|---|---|
| Expo SDK 51 (managed) | Cross-platform iOS + Android |
| React Navigation v6 | Bottom tabs + stack navigation |
| TanStack Query v5 | API caching, offline support |
| Expo AV | Native audio player |
| Expo Notifications | Push notification handler |
| expo-video / expo-web-browser | Video + live stream |
| MMKV / AsyncStorage | Token + settings persistence |
| Zustand | Auth state + player state |
| i18n-js | EN/UR translations |
| `react-native-rtl-layout` | RTL layout helpers |

### 4.1 Navigation Structure

```
Bottom Tabs:
├── 🏠 Home
├── 🎧 Bayanaat (Audio)
├── 📹 Videos
├── 📚 Dars-e-Nizami
└── ☰ More (Q&A, Downloads, About, Profile)

Stack Navigators (inside each tab):
├── HomeStack → Home → AudioDetail / VideoDetail
├── AudioStack → AudioList → AudioDetail
├── VideoStack → VideoList → VideoDetail
├── ClassStack → ClassList → ClassDetail → LiveStream
└── MoreStack → QA / Downloads / Profile / Settings
```

### 4.2 Screen Inventory

| Screen | Key Features |
|---|---|
| **Splash** | Logo animation, token check → auto-login |
| **Onboarding** | 3-slide intro (first launch only) |
| **Home** | Prayer times widget, news ticker, latest audio cards, latest video cards |
| **Audio List** | Pull-to-refresh, infinite scroll, category/year/speaker filter chips, search |
| **Audio Detail** | Full-screen player, waveform progress, speaker chip, tags, share, download-for-offline |
| **Audio Player (Mini)** | Persistent bottom bar when audio playing |
| **Video List** | Grid, thumbnail, views counter |
| **Video Detail** | YouTube WebView player, urdu_title (RTL), related videos |
| **Class List** | Cards with 🔴 Live badge if `live_link` active |
| **Class Detail** | Sessions list, teacher+book per session |
| **Live Stream** | YouTube live WebView (`youtube_live_link`) in-app |
| **Q&A List** | Topic filter header, accordion items |
| **Q&A Detail** | Full question + answer, RTL for Urdu content |
| **Downloads** | Category grouped, tap → open URL |
| **Login** | Email + password, Sanctum token → MMKV |
| **Register** | Full admission form (all user_details fields) |
| **Profile** | Name, reg no., class, approval badge, subscription toggle |
| **Settings** | Language toggle (EN/UR), notification prefs, app version |
| **Notification Center** | List of received push notifications |

### 4.3 Offline Audio (Expo FileSystem + TanStack Query)

```typescript
// Download audio for offline playback
const downloadAudio = async (audio: AudioResource) => {
  const filename = `audio_${audio.id}.mp3`;
  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.downloadAsync(audio.url, fileUri);
  await MMKV.set(`offline_${audio.id}`, fileUri);
};

// Play: check offline first, fallback to stream
const getAudioSource = (audio: AudioResource) => {
  const offlinePath = MMKV.getString(`offline_${audio.id}`);
  return offlinePath ? { uri: offlinePath } : { uri: audio.url };
};
```

### 4.4 Push Notifications (FCM via Laravel)

```php
// Laravel side:
// POST /api/v1/device-tokens  → stores FCM token in device_tokens table

// Triggered by admin broadcast or automated events:
// - New audio published (after publish_date)
// - New video uploaded
// - Live class starting (manual trigger from admin)

// Notification classes:
class NewAudioPublished extends Notification {
    public function toFcm($notifiable) {
        return (new FcmMessage())
            ->setTitle('New Bayan Available')
            ->setBody($this->audio->title)
            ->setData(['type' => 'audio', 'id' => $this->audio->id]);
    }
}
```

### 4.5 API Config (React Native)

```typescript
// api/client.ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // https://domain.com/api/v1

const apiClient = axios.create({ baseURL: BASE_URL });

// Sanctum Bearer token from MMKV
apiClient.interceptors.request.use(config => {
    const token = mmkv.getString('sanctum_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

---

## PHASE 5 — Security, Polish & Hardening (Week 12)

### 5.1 API Security
```php
// Rate limiting
Route::middleware(['throttle:60,1'])->group(...);  // Public
Route::middleware(['throttle:30,1'])->group(...);  // Auth endpoints

// CORS (for React Native different origin)
// config/cors.php → allowed_origins: ['*'] for API routes
// allowed_headers: ['Authorization', 'Content-Type', 'X-Requested-With']
```

### 5.2 Form Request Validation
All API endpoints get dedicated `FormRequest` classes with:
- Localized error messages (EN + UR)
- Type coercion for mobile inputs

### 5.3 RTL Polish Pass
- Audit all Inertia pages for LTR-hardcoded styles
- Test Arabic numeral rendering in prayer times
- Verify Noto Nastaliq font loads correctly for Urdu text blocks
- Test audio player controls mirror correctly in RTL

### 5.4 Performance
- **Eager loading** everywhere (eliminate N+1 via `with()`)
- **API response caching**: `Cache::remember()` for prayer timings, categories, years (rarely change)
- **Image optimization**: `intervention/image` to resize thumbnails on upload
- **Queue**: Email sending for registration, push notifications

---

## PHASE 6 — Testing & Deployment (Week 13)

### 6.1 Automated Tests
```bash
# Feature tests for API
php artisan test --filter=ApiAudioTest
php artisan test --filter=ApiAuthTest

# Test coverage targets:
# - All 15+ API endpoints: request/response shape
# - Auth: login, logout, register, token expiry
# - Admin CRUD: create/update/delete for each resource
```

### 6.2 Deployment Checklist
```bash
# Database (against old production DB)
php artisan migrate --force           # Only additive migrations run
php artisan db:seed --class=RolePermissionMigrationSeeder  # One-time only

# Assets
npm run build
php artisan inertia:start-ssr         # If SSR enabled
php artisan storage:link

# Queue & Scheduler
php artisan queue:work --daemon
php artisan schedule:run              # For publish_date-based audio publishing

# Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 6.3 React Native Release
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
eas submit --platform android
```

---

## 📅 MASTER TIMELINE

| Phase | Weeks | Key Deliverables |
|---|---|---|
| **Phase 0** | Week 1 | Laravel 13 scaffold, packages installed, old DB connected, Sanctum configured |
| **Phase 1** | Week 2 | All 21+ models, consolidated migrations, full API v1 routes + resources |
| **Phase 2** | Weeks 3–5 | Admin Panel: all 20+ pages, RBAC, file uploads, dashboard |
| **Phase 3** | Weeks 6–8 | Website: all pages, RTL toggle, audio player, student registration |
| **Phase 4** | Weeks 9–11 | React Native: all screens, offline audio, push notifications, live stream |
| **Phase 5** | Week 12 | Security hardening, RTL polish, performance optimization |
| **Phase 6** | Week 13 | Tests, CI/CD, deployment scripts, app store submission |

**Total: 13 weeks across 3 platforms**

---

## ⚠️ CRITICAL MIGRATION NOTES

> [!IMPORTANT]
> **Zero data loss strategy:** The new Laravel 13 project connects to the SAME database. All new migrations use `Schema::hasTable()` guards. No existing table is dropped or destructively altered.

> [!WARNING]
> **Old API compatibility:** Current mobile app uses `iD` (uppercase D) and Passport tokens. The new API uses `id` and Sanctum tokens. The React Native app MUST be deployed simultaneously with the new API backend — do NOT swap the backend while the old mobile app is still live in the store.

> [!NOTE]
> **Spatie Tags upgrade:** v2 → v4 has schema changes. Check if `tags` table schema matches v4 requirements before running migrations. May need a data migration step for the JSON columns.

> [!TIP]
> **Start execution with Phase 0 + Phase 1 first** — get the API running and tested before building any UI. Both the Admin and Website frontends depend on the same Inertia controllers.
