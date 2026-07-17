import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users, IndianRupee } from 'lucide-react';
import { fetchCourses } from '../../../store/slice/courseSlice.js';
import { fetchActiveCourseCategories } from '../../../store/slice/courseCategorySlice.js';
import SEO from '../../../components/common/SEO.jsx';

const CoursesListPage = () => {
    const dispatch = useDispatch();
    const { data: courses, loading } = useSelector((state) => state.courses);
    const { activeData: categories } = useSelector((state) => state.courseCategories);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        dispatch(fetchCourses({ isActive: true, admissionOpen: true }));
        dispatch(fetchActiveCourseCategories());
    }, [dispatch]);

    const filtered = courses.filter(c => {
        if (selectedCategory && c.category?._id !== selectedCategory) return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const getTotalFee = (course) => {
        if (!course.feeComponents?.length) return 'N/A';
        const total = course.feeComponents.reduce((s, c) => s + (Number(c.amount) || 0), 0);
        return `₹${total.toLocaleString('en-IN')}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Our Courses</h1>

            <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search courses..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full border rounded-lg pl-10 pr-4 py-2 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading courses...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No courses found matching your criteria.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(course => (
                        <div key={course._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                            {course.thumbnail && (
                                <img src={course.thumbnail} alt={course.name} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4 space-y-3">
                                <h3 className="text-lg font-semibold">{course.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Clock size={14} /> {course.duration}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{course.eligibility}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-primary">{getTotalFee(course)}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${course.admissionOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {course.admissionOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/courses/${course._id}`}
                                        className="flex-1 text-center px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition text-sm">
                                        View Details
                                    </Link>
                                    <Link to={`/apply/${course._id}`}
                                        className="flex-1 text-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm">
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesListPage;