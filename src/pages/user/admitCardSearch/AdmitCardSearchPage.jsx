import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchAdmitCardPageBySlug } from '../../../store/thunk/admitCardPageThunk';
import { searchAdmitCards } from '../../../store/thunk/admitCardThunk';
import { clearSearchResults } from '../../../store/slice/admitCardSlice';
import { Search, ChevronRight, Home, FileText, Loader2, X, ExternalLink, User, Building2, Hash } from 'lucide-react';
import SEO from '../../../components/common/SEO';
import PopupModel from '../../../components/ui/PopupModel';
import Button from '../../../components/ui/Button';

const AdmitCardSearchPage = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { currentPage, loading: pageLoading, error: pageError } = useSelector((state) => state.admitCardPages);
    const { searchResults, loading: searchLoading } = useSelector((state) => state.admitCards);
    const [query, setQuery] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const debounceRef = useRef(null);
    const pageIdRef = useRef(null);

    useEffect(() => {
        if (slug) {
            dispatch(fetchAdmitCardPageBySlug(slug));
            dispatch(clearSearchResults());
        }
    }, [dispatch, slug]);

    useEffect(() => {
        setQuery('');
        dispatch(clearSearchResults());
        setSelectedCard(null);
    }, [slug]);

    useEffect(() => {
        if (currentPage?._id) {
            pageIdRef.current = currentPage._id;
        }
    }, [currentPage]);

    const handleSearch = useCallback((value) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.trim().length < 1) {
            dispatch(clearSearchResults());
            return;
        }
        const pid = pageIdRef.current;
        if (!pid) return;
        debounceRef.current = setTimeout(() => {
            dispatch(searchAdmitCards({ pageId: pid, q: value.trim() }));
        }, 300);
    }, [dispatch]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return (
        <>
            <SEO
                title={(currentPage?.title || 'Admit Card') + ' - Search'}
                description={'Search and download ' + (currentPage?.title || 'admit card') + ' by application no or name.'}
                keywords="admit card, search admit card, hall ticket"
            />
            <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-8">
                    <div className="max-w-[1200px] mx-auto">
                        <nav className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-3">
                            <Link to="/" className="hover:text-white transition-colors"><Home size={10} /></Link>
                            <ChevronRight size={10} />
                            <Link to="/admit-cards" className="hover:text-white transition-colors">Admit Cards</Link>
                            <ChevronRight size={10} />
                            <span className="text-white">{currentPage?.title || 'Search'}</span>
                        </nav>
                        <h1 className="text-2xl font-black text-white tracking-tight">{currentPage?.title || 'Admit Card'}</h1>
                        {currentPage?.description && (
                            <p className="text-white/80 text-xs mt-1">{currentPage.description}</p>
                        )}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Enter Application No / Registration No or Student Name..."
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                autoFocus
                            />
                            {query && (
                                <button onClick={() => { setQuery(''); dispatch(clearSearchResults()); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {pageLoading && !currentPage && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={24} className="animate-spin text-primary" />
                            <span className="ml-3 text-sm font-medium text-slate-500">Loading page...</span>
                        </div>
                    )}

                    {pageError && !currentPage && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-10 text-center">
                            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-400 font-bold">Page not found</p>
                            <p className="text-xs text-slate-400 mt-1">The admit card page you're looking for doesn't exist.</p>
                            <Link to="/admit-cards" className="mt-4 inline-block text-sm font-bold text-blue-600 hover:underline">Browse all pages</Link>
                        </div>
                    )}

                    {currentPage && (
                        <div className="mt-4 space-y-3">
                            {searchLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 size={24} className="animate-spin text-primary" />
                                    <span className="ml-3 text-sm font-medium text-slate-500">Searching...</span>
                                </div>
                            )}

                            {!searchLoading && query && searchResults.length === 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-10 text-center">
                                    <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-slate-400 font-bold">No admit cards found</p>
                                    <p className="text-xs text-slate-400 mt-1">Try searching with a different application no or name.</p>
                                </div>
                            )}

                            {!searchLoading && !query && (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-10 text-center">
                                    <Search size={40} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-slate-400 font-bold">Search your admit card</p>
                                    <p className="text-xs text-slate-400 mt-1">Enter your application no or full name above.</p>
                                </div>
                            )}

                        {searchResults.map((card) => (
                            <div key={card._id}
                                onClick={() => setSelectedCard(card)}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-3 flex-1 min-w-0">

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-green-500 shrink-0" />
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Name</p>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{card.studentName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Hash size={14} className="text-purple-500 shrink-0" />
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Application No / Reg No</p>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{card.rollNumber}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                                        {card.admitCardFile ? (
                                            <button onClick={(e) => { e.stopPropagation(); setSelectedCard(card); }}
                                                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
                                                <ExternalLink size={14} /> View Admit Card
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No admit card file uploaded yet</span>
                                        )}
                                        {card.additionalInfo && (
                                            <span className="text-[10px] text-slate-400 ml-2">{card.additionalInfo}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>

            <PopupModel
                isOpen={!!selectedCard}
                onClose={() => setSelectedCard(null)}
                title="Admit Card Details"
                maxWidth="max-w-3xl"
            >
                {selectedCard && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application No</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedCard.rollNumber}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Name</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedCard.studentName}</p>
                            </div>

                            {selectedCard.additionalInfo && (
                                <div className="col-span-full mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Additional Info</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedCard.additionalInfo}</p>
                                </div>
                            )}
                        </div>

                        {selectedCard.admitCardFile ? (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video md:aspect-[1/1.2] relative flex items-center justify-center">
                                {selectedCard.admitCardFile.toLowerCase().endsWith('.pdf') ? (
                                    <iframe src={selectedCard.admitCardFile} className="w-full h-full border-0" title="Admit Card PDF" />
                                ) : (
                                    <img src={selectedCard.admitCardFile} alt="Admit Card" className="w-full h-full object-contain" />
                                )}
                            </div>
                        ) : (
                            <div className="p-10 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-400">No admit card file uploaded.</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-2 gap-2">
                            {selectedCard.admitCardFile && (
                                <a href={selectedCard.admitCardFile} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                                    <ExternalLink size={16} /> Open in New Tab
                                </a>
                            )}
                            <Button variant="secondary" onClick={() => setSelectedCard(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </PopupModel>
        </>
    );
};

export default AdmitCardSearchPage;
