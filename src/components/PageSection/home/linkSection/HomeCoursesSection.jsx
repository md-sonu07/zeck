import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GraduationCap, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { fetchActiveCourseCategories } from '../../../../store/slice/courseCategorySlice';
import { fetchCourses } from '../../../../store/slice/courseSlice';

const HomeCoursesSection = ({ hideViewAll = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const [catsResult, coursesResult] = await Promise.all([
                    dispatch(fetchActiveCourseCategories()).unwrap(),
                    dispatch(fetchCourses()).unwrap()
                ]);
                setCategories(catsResult || []);
                setCourses(coursesResult || []);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [dispatch]);

    const handleApplyClick = (course) => {
        navigate(`/course-apply/${course.slug || course._id}`);
    };

    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift mb-8">
            <div className="bg-linear-to-r from-purple-700 to-indigo-800 px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen size={15} /> Courses, Universities & Colleges
                </h2>
                {!hideViewAll && (
                    <Link to="/university-cources" className="text-[10px] font-black bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors uppercase tracking-widest cursor-pointer">
                        View All
                    </Link>
                )}
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="animate-spin text-purple-600" size={30} />
                    </div>
                ) : categories.length > 0 ? (
                    <div className="space-y-8">
                        {categories.map(category => {
                            const categoryCourses = courses.filter(c =>
                                (c.category?._id || c.category) === category._id && !c.deletedAt
                            );

                            if (categoryCourses.length === 0) return null;

                            return (
                                <div key={category._id} className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs">
                                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                        <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                                            <GraduationCap size={16} className="text-purple-600" />
                                            {category.name}
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {categoryCourses.map(course => (
                                            <div key={course._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-[15px] leading-tight mb-1">
                                                        {course.name}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-medium mt-2">
                                                        {course.duration && (
                                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> <span className="font-semibold text-slate-600 dark:text-slate-400">Duration:</span> {course.duration}</span>
                                                        )}
                                                        {course.eligibility && (
                                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> <span className="font-semibold text-slate-600 dark:text-slate-400">Eligibility:</span> {course.eligibility}</span>
                                                        )}
                                                        {course.totalFee > 0 && (
                                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> <span className="font-semibold text-slate-600 dark:text-slate-400">Total Fee:</span> ₹{course.totalFee.toLocaleString('en-IN')}</span>
                                                        )}
                                                        {course.studentCreditCard && (
                                                            <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Student Credit Card Eligible</span>
                                                        )}
                                                        {course.feeComponents && course.feeComponents.length > 0 && course.feeComponents.map((fee, idx) => (
                                                            <span key={idx} className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> <span className="font-semibold text-slate-600 dark:text-slate-400">{fee.label}:</span> ₹{fee.amount.toLocaleString('en-IN')}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="shrink-0 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => handleApplyClick(course)}
                                                        className="w-full sm:w-auto cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-purple-600/30 transition-all active:scale-95"
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-8 text-center text-slate-400 text-sm font-medium">
                        No courses available at the moment.
                    </div>
                )}

                 {/* Footer */}
            {!hideViewAll && (
                <div className="px-4 py-2.5 mt-4 rounded-md bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
                    <Link
                        to="/university-cources"
                        className="group/footer text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 inline-flex items-center gap-1.5 transition-colors duration-200 no-underline"
                    >
                        View All Courses & Universities
                        <ArrowRight size={11} className="transition-transform duration-200 group-hover/footer:translate-x-1" />
                    </Link>
                </div>
            )}
            </div>
        </section>
    );
};

export default HomeCoursesSection;
