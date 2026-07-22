import React from 'react';
import { Flame, GraduationCap, IdCard, Key } from 'lucide-react';
import HeroBanner from '../../../components/PageSection/home/HeroBanner';
import NoticeMarquee from '../../../components/PageSection/home/NoticeMarquee';
import FilterStrip from '../../../components/PageSection/home/FilterStrip';
import LatestNewsSection from '../../../components/PageSection/home/linkSection/LatestNewsSection';
import AdmitCardSection from '../../../components/PageSection/home/linkSection/AdmitCardSection';
import AdmitCardBEdDElEdSection from '../../../components/PageSection/home/linkSection/AdmitCardBEdDElEdSection';
import ResultsSection from '../../../components/PageSection/home/linkSection/ResultsSection';
import AnswerKeySyllabus from '../../../components/PageSection/home/linkSection/AnswerKeySyllabus';
import StudentFeedbackSection from '../../../components/PageSection/home/StudentFeedbackSection';
import HomeCoursesSection from '../../../components/PageSection/home/linkSection/HomeCoursesSection';
import Sidebar from '../../../components/PageSection/home/Sidebar';
import MobileQuickMenu from '../../../components/PageSection/home/MobileQuickMenu';
import SEO from '../../../components/common/SEO';

const HomePage = () => {
    return (
        <div className="pb-10">
            <SEO
                title="Home"
                description="Zoya Education Center - Your trusted source for latest government job notifications, admit cards, exam results, answer keys, syllabus, and university admission updates across India. Get real-time alerts."
                keywords="government jobs, sarkari naukri, admit card 2026, exam results, answer key, university admission, latest news, job notification, Bihar jobs, India jobs, Zoya Education Center, online form, syllabus download"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://zoyaeducation.com/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Latest News",
                            "item": "https://zoyaeducation.com/latest-news"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Admit Card",
                            "item": "https://zoyaeducation.com/admit-card"
                        },
                        {
                            "@type": "ListItem",
                            "position": 4,
                            "name": "Results",
                            "item": "https://zoyaeducation.com/result"
                        }
                    ]
                }}
            />
            <HeroBanner />
            <NoticeMarquee />
            <FilterStrip />

            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-9 space-y-8">
                        {/* Section Label */}
                        <div className="section-label mt-4">
                            <GraduationCap className="text-slate-500" size={10} /> Study Resources
                        </div>          

                        {/* Courses Section */}
                        <HomeCoursesSection />
                        <AdmitCardBEdDElEdSection />

                        {/* Latest News */}
                        <div className="section-label">
                            <Flame className="text-accent" size={10} /> Latest News & Updates
                        </div>
                        <LatestNewsSection />

                        <div className="section-label mt-4">
                            <IdCard className="text-blue-500" size={10} /> Examination Portal
                        </div>

                        <AdmitCardSection />
                        <ResultsSection />
                        {/* <AnswerKeySyllabus /> */}

                        {/* Student Feedback */}
                        <StudentFeedbackSection />
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-3">
                        <Sidebar />
                        <MobileQuickMenu />

                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
