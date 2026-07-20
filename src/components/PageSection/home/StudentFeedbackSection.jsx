import React from 'react';
import { Quote, Star, GraduationCap } from 'lucide-react';

const StudentFeedbackSection = () => {
    const feedbacks = [
        {
            name: "Md Hajrat",
            course: "D.El.Ed",
            eligibility: "10+2",
            fee: "₹40,000 / Yr",
            review: "Great guidance and transparent fee structure!",
            rating: 5,
            image: "https://ui-avatars.com/api/?name=Md+Hajrat&background=0D8ABC&color=fff&size=128",
            color: "from-blue-500 to-cyan-400"
        },
        {
            name: "Jay Kumar Yadav",
            course: "B.Ed",
            eligibility: "Grad.",
            fee: "₹50,000 / Yr",
            review: "Dedicated support and structured counseling.",
            rating: 5,
            image: "https://ui-avatars.com/api/?name=Jay+Kumar+Yadav&background=8B5CF6&color=fff&size=128",
            color: "from-purple-500 to-pink-500"
        },
        {
            name: "Lata Kumari",
            course: "D.El.Ed",
            eligibility: "10+2",
            fee: "₹40,000 / Yr",
            review: "Smooth admission process, highly recommended.",
            rating: 5,
            image: "https://ui-avatars.com/api/?name=Lata+Kumari&background=F59E0B&color=fff&size=128",
            color: "from-amber-500 to-orange-400"
        },
        {
            name: "Jyoti Kumari",
            course: "B.Ed",
            eligibility: "Grad.",
            fee: "₹50,000 / Yr",
            review: "Best place to secure B.Ed admission easily.",
            rating: 5,
            image: "https://ui-avatars.com/api/?name=Jyoti+Kumari&background=10B981&color=fff&size=128",
            color: "from-emerald-500 to-teal-400"
        },
        {
            name: "Sanjana Kumari",
            course: "D.El.Ed",
            eligibility: "10+2",
            fee: "₹40,000 / Yr",
            review: "Very helpful staff and excellent guidance.",
            rating: 5,
            image: "https://ui-avatars.com/api/?name=Sanjana+Kumari&background=EC4899&color=fff&size=128",
            color: "from-pink-500 to-rose-400"
        },
        {
            name: "Deepan Kumar",
            course: "B.Ed",
            eligibility: "Grad.",
            fee: "₹50,000 / Yr",
            review: "Highly professional and supportive environment.",
            rating: 5,
            image: "https://ui-avatars.com/api/?name=Deepan+Kumar&background=3B82F6&color=fff&size=128",
            color: "from-blue-600 to-indigo-500"
        }
    ];

    return (
        <div className="mt-12 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-100 p-2 rounded-xl shadow-sm border border-yellow-200">
                    <Quote className="text-yellow-600" size={16} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Student <span className="text-primary">Feedback</span></h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Success Stories</p>
                </div>
            </div>

            {/* Changed from lg:grid-cols-4 to lg:grid-cols-3 to perfectly balance 6 cards in 2 rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {feedbacks.map((item, index) => (
                    <div key={index} className="group relative bg-white rounded-xl p-5 shadow-md shadow-slate-200/50 border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[180px]">
                        {/* Decorative background gradient */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${item.color} opacity-[0.08] rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500`}></div>
                        
                        <div className="flex items-center gap-3 mb-3">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-10 h-10 rounded-full shadow-sm border border-slate-100 object-cover" 
                            />
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 leading-none">{item.name}</h3>
                                <p className="text-[11px] text-primary font-semibold flex items-center gap-1 mt-1">
                                    <GraduationCap size={10} /> {item.course}
                                </p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-slate-600 italic text-xs leading-snug">
                                &quot;{item.review}&quot;
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-2 flex justify-between items-center border border-slate-100">
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Eligibility</p>
                                <p className="text-xs font-semibold text-slate-700">{item.eligibility}</p>
                            </div>
                            <div className="w-px h-6 bg-slate-200"></div>
                            <div className="text-right">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Course Fee</p>
                                <p className="text-xs font-bold text-green-600">{item.fee}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentFeedbackSection;
