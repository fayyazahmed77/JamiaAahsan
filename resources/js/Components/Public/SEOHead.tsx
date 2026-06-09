import React from 'react';
import { Head, usePage } from '@inertiajs/react';

interface SEOHeadProps {
    title: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    canonical?: string;
}

export default function SEOHead({
    title,
    description = "Jamia Arabia Ahsan Ul Uloom is a premier Islamic education institution in Karachi, Pakistan, offering Nazira, Hifz, and Dars-e-Nizami programs.",
    keywords = "Jamia Ahsan, Ahsan Ul Uloom, Islamic school Karachi, Islamic education, Hifz Quran, Dars-e-Nizami, fatwa online, Islamic lectures, Mufti Abu Lubaba",
    ogImage = "/images/og-default.jpg",
    ogType = "website",
    canonical
}: SEOHeadProps) {
    const { url } = usePage();
    const siteUrl = "https://jamiaahsan.edu.pk";
    const currentCanonical = canonical || `${siteUrl}${url}`;
    const defaultOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

    return (
        <Head>
            <title>{`${title} - Jamia Arabia Ahsan Ul Uloom`}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Canonical Link */}
            <link rel="canonical" href={currentCanonical} />

            {/* OpenGraph Metas */}
            <meta property="og:title" content={`${title} - Jamia Arabia Ahsan Ul Uloom`} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={currentCanonical} />
            <meta property="og:image" content={defaultOgImage} />
            <meta property="og:site_name" content="Jamia Arabia Ahsan Ul Uloom" />

            {/* Twitter Metas */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${title} - Jamia Arabia Ahsan Ul Uloom`} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={defaultOgImage} />
        </Head>
    );
}
