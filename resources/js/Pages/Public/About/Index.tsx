import React from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import { AboutHero } from './components/AboutHero';
import { StoryPreview } from './components/StoryPreview';
import { MissionVision } from './components/MissionVision';
import { InteractiveTimeline } from './components/InteractiveTimeline';
import { CounterGrid } from './components/CounterGrid';
import { DepartmentsGrid } from './components/DepartmentsGrid';
import { LeadershipPreview } from './components/LeadershipPreview';
import { FacultyPreview } from './components/FacultyPreview';
import { CampusGallery } from './components/CampusGallery';
import { CommunityImpact } from './components/CommunityImpact';
import { TestimonialSlider } from './components/TestimonialSlider';
import { FutureVision } from './components/FutureVision';
import { CallToActionBox } from './components/CallToActionBox';

export interface Department {
    id: number;
    slug: string;
    name: string;
    name_urdu: string;
    description: string;
    description_urdu: string;
    icon_name: string;
    sort_order: number;
}

export interface Scholar {
    id: number;
    name: string;
    urdu_name: string;
    is_leadership: boolean;
    designation: string;
    designation_urdu: string;
    bio: string;
    bio_urdu: string;
    photo_uri: string;
    sort_order: number;
}

export interface StatsData {
    years_of_service: number;
    students_count: number;
    faculty_count: number;
    audio_count: number;
    video_count: number;
    fatwa_count: number;
}

interface AboutIndexProps {
    departments: Department[];
    leadership: Scholar[];
    faculty_preview: Scholar[];
    stats: StatsData;
}

export default function AboutIndex({ departments, leadership, faculty_preview, stats }: AboutIndexProps) {
    return (
        <>
            <SEOHead 
                title="About Us"
                description="Discover Jamia Ahsan-ul-Uloom (Jamia Ahsan), bridging classical theological scholarship with modern educational tools, digital innovation, and active community service."
            />

            <div className="bg-stone-50 dark:bg-[#0c0a09] transition-colors duration-300">
                {/* 1. Hero Experience */}
                <AboutHero />

                {/* 2. Our Story */}
                <StoryPreview />

                {/* 3. Mission & Vision */}
                <MissionVision />

                {/* 4. Interactive Timeline */}
                <InteractiveTimeline />

                {/* 5. Statistics Counters */}
                <CounterGrid stats={stats} />

                {/* 6. Departments Showcase */}
                <DepartmentsGrid departments={departments} />

                {/* 7. Leadership Profiles Preview */}
                <LeadershipPreview leadership={leadership} />

                {/* 8. Faculty Roster Preview */}
                <FacultyPreview faculty_preview={faculty_preview} />

                {/* 9. Campus Gallery */}
                <CampusGallery />

                {/* 10. Community Impact */}
                <CommunityImpact />

                {/* 11. Testimonials Slider */}
                <TestimonialSlider />

                {/* 12. Future Vision */}
                <FutureVision />

                {/* 13. Call To Action Box */}
                <CallToActionBox />
            </div>
        </>
    );
}

// Wrap page inside the Public layout
AboutIndex.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
