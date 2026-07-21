import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    author = "Zoya Education Center",
    image = "https://zoyaeducation.com/logo/light-logo.png",
    url,
    type = "website",
    noindex = false,
    jsonLd = null,
}) => {
    const siteName = "Zoya Education Center";
    const siteUrl = "https://zoyaeducation.com";
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Government Jobs, Admit Cards, Results & Admission Updates`;
    const defaultDescription = "Zoya Education Center - Your trusted source for latest government job notifications, admit cards, exam results, answer keys, and university admission updates across India.";
    const metaDescription = description || defaultDescription;
    const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
    const metaImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            )}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Canonical Link */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Language */}
            <html lang="en" />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
