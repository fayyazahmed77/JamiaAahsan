import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import SEOHead from '@/Components/Public/SEOHead';
import type { Audio, Video, PrayerTiming, LatestNews as NewsType, Klass } from '@/types/models';

// Import our new premium modular components
import HeroSlider from '@/Components/Public/HeroSlider';
import PrayerTimes from '@/Components/Public/PrayerTimes';
import BayanatSection from '@/Components/Public/BayanatSection';
import RecentBayanat from '@/Components/Public/RecentBayanat';
import FeatureCards from '@/Components/Public/FeatureCards';
import CollectionSection from '@/Components/Public/CollectionSection';
import LatestVideos from '@/Components/Public/LatestVideos';
import GridHub from '@/Components/Public/GridHub';
import ArticlesBlog from '@/Components/Public/ArticlesBlog';
import DonateSection from '@/Components/Public/DonateSection';
import AppPromotion from '@/Components/Public/AppPromotion';

interface Banner {
    id: number;
    title?: string;
    subtitle?: string;
    image_url?: string;
    link_url?: string;
    button_text?: string;
    is_active: boolean;
    sort_order?: number;
}

interface HomeProps {
    banners: Banner[];
    prayer_timings: PrayerTiming[];
    latest_news: NewsType[];
    featured_audio: Audio[];
    featured_video: Video[];
    classes: Klass[];
    stats: {
        audio_count: number;
        video_count: number;
        teacher_count: number;
        class_count: number;
    };
}

export default function Home({ banners, prayer_timings, latest_news, featured_audio, featured_video, classes, stats }: HomeProps) {
    return (
        <>
            <SEOHead 
                title="Preserving Legacy, Inspiring Minds" 
                description="Welcome to Jamia Arabia Ahsan Ul Uloom, a center of classical Islamic education and spiritual enrichment in Karachi, Pakistan."
            />
            
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Jamia Arabia Ahsan Ul Uloom",
                    "url": "https://jamiaahsan.edu.pk",
                    "logo": "https://jamiaahsan.edu.pk/images/logo.png",
                    "sameAs": [
                        "https://facebook.com/jamiaahsan",
                        "https://youtube.com/jamiaahsan"
                    ],
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+92-21-34981234",
                        "contactType": "general inquiries"
                    }
                })}
            </script>

            {/* 1. Hero Admissions Slider */}
            <HeroSlider />

            {/* 2. Prayer Timings Strip */}
            <PrayerTimes prayer_timings={prayer_timings} />

            {/* 3. Live & Latest Bayanat Section */}
            <BayanatSection />

            {/* 4. Recent Bayanat Players */}
            <RecentBayanat featured_audio={featured_audio} />

            {/* 5. Custom Study Feature Cards */}
            <FeatureCards />

            {/* 6. Explorer Collection Circle Cards */}
            <CollectionSection />

            {/* 7. Latest Videos Playlist */}
            <LatestVideos featured_video={featured_video} />

        

            {/* 9. Bottom Information and Contact Grid Hub */}
            <GridHub />
    {/* 8. Donate Now Section */}
            <DonateSection />
            {/* 9. Articles & Blog Section */}
            <ArticlesBlog />

            {/* 10. Mobile App Promotion */}
            <AppPromotion />
        </>
    );
}

// Assign layout context to preserve persistent player states
Home.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
