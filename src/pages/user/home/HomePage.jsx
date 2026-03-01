import React from 'react';
import { Flame, GraduationCap, IdCard, Key } from 'lucide-react';
import HeroBanner from '../../../components/PageSection/home/HeroBanner';
import NoticeMarquee from '../../../components/PageSection/home/NoticeMarquee';
import FilterStrip from '../../../components/PageSection/home/FilterStrip';
import LatestNewsSection from '../../../components/PageSection/home/linkSection/LatestNewsSection';
import AdmitCardSection from '../../../components/PageSection/home/linkSection/AdmitCardSection';
import ResultsSection from '../../../components/PageSection/home/linkSection/ResultsSection';
import AnswerKeySyllabus from '../../../components/PageSection/home/linkSection/AnswerKeySyllabus';
import UniversityBoardUpdates from '../../../components/PageSection/home/linkSection/UniversityBoardUpdates';
import Sidebar from '../../../components/PageSection/home/Sidebar';

const HomePage = () => {
    return (
        <div className="pb-10">
            <HeroBanner />
            <NoticeMarquee />
            <FilterStrip />

            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="section-label">
                            <Flame className="text-accent" size={10} /> Latest News & Updates
                        </div>

                        {/* Latest News */}
                        <LatestNewsSection />

                        <div className="section-label mt-4">
                            <IdCard className="text-blue-500" size={10} /> Examination Portal
                        </div>

                        {/* Admit Card + Results side-by-side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdmitCardSection />
                            <ResultsSection />
                        </div>

                        {/* Section Label */}
                        <div className="section-label mt-4">
                            <GraduationCap className="text-purple-500" size={10} /> Academic Updates
                        </div>
                        {/* University & Board Updates */}
                        <UniversityBoardUpdates />

                        {/* Section Label */}
                        <div className="section-label mt-4">
                            <Key className="text-slate-500" size={10} /> Study Resources
                        </div>
                        {/* Answer Key & Syllabus */}
                        <AnswerKeySyllabus />

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4">
                        <Sidebar />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
