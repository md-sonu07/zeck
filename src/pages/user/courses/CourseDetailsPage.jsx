import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { fetchCourseById, clearCurrentCourse } from '../../../store/slice/courseSlice.js';
import SEO from '../../../components/common/SEO';

const CourseDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentCourse: course, loading } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCourseById(id));
        return () => dispatch(clearCurrentCourse());
    }, [dispatch, id]);

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!course) return <div className="text-center py-12">Course not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <SEO
                title={course.name}
                description={course.description ? course.description.substring(0, 160) : `${course.name} - Course details, eligibility, fee structure, and admission information at Zoya Education Center.`}
                keywords={`${course.name}, ${course.category?.name || ''}, admission, course details, fee structure, eligibility`}
                image={course.thumbnail}
                type="article"
            />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {course.thumbnail && (
                    <img src={course.thumbnail} alt={course.name} className="w-full h-64 object-cover" />
                )}
                <div className="p-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
                        <p className="text-sm text-gray-500">Code: {course.courseCode}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold">{course.duration}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-semibold">{course.category?.name}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p className="text-sm text-gray-500">Total Seats</p>
                            <p className="font-semibold">{course.totalSeats || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${course.admissionOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {course.admissionOpen ? 'Admission Open' : 'Closed'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-3">Eligibility</h2>
                        <p className="text-gray-600 dark:text-gray-400">{course.eligibility}</p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-3">Fee Structure</h2>
                        {course.feeComponents?.length > 0 ? (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b dark:border-gray-600">
                                            <th className="text-left py-2 text-sm font-medium">Component</th>
                                            <th className="text-right py-2 text-sm font-medium">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {course.feeComponents.map((comp, idx) => (
                                            <tr key={idx} className="border-b dark:border-gray-600 last:border-0">
                                                <td className="py-2 text-sm">{comp.label}</td>
                                                <td className="py-2 text-sm text-right">₹{Number(comp.amount).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                        <tr className="font-bold border-t-2 dark:border-gray-500">
                                            <td className="py-2 text-sm">Total</td>
                                            <td className="py-2 text-sm text-right">
                                                ₹{course.feeComponents.reduce((s, c) => s + (Number(c.amount) || 0), 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-gray-500">No fee information available.</p>}
                    </div>

                    {course.requiredDocuments?.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-3">Required Documents</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {course.requiredDocuments.map((doc, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        {doc.required ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
                                        <span>{doc.name}</span>
                                        <span className="text-xs text-gray-500">({doc.required ? 'Required' : 'Optional'})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {course.universities?.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-3">Affiliated Universities</h2>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                {course.universities.map((uni, idx) => (
                                    <li key={idx} className="text-sm">{uni}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {course.customQuestions?.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-3">Additional Questions</h2>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                {course.customQuestions.map((q, idx) => (
                                    <li key={idx}>{q.label} {q.required && <span className="text-red-500">*</span>}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {course.brochure && (
                        <div className="mt-6">
                            <a href={course.brochure} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                                Download Brochure
                            </a>
                        </div>
                    )}

                    <div className="mt-8">
                        <Link to={`/apply/${course._id}`}
                            className="inline-block bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition">
                            Apply Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
