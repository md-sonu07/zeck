import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchAdmitCardPageBySlug } from '../../../store/thunk/admitCardPageThunk';
import { searchAdmitCards } from '../../../store/thunk/admitCardThunk';
import { clearSearchResults } from '../../../store/slice/admitCardSlice';
import { Search, ChevronRight, Home, FileText, X, ExternalLink, Download, User, Building2, Hash } from 'lucide-react';
import { ListItemsSkeleton } from '../../../components/common/Skeleton';
import AdmitCardSearchSkeleton from '../../../components/common/AdmitCardSearchSkeleton';
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
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
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

    useEffect(() => {
        const checkMobile = () => setIsMobileDevice(window.matchMedia('(max-width: 767px)').matches);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const searchLimit = 20;

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
            dispatch(searchAdmitCards({ pageId: pid, q: value.trim(), limit: searchLimit, page: 1 }));
        }, 300);
    }, [dispatch]);

    const handleDownload = async () => {
        if (!selectedCard?.admitCardFile) return;
        setDownloadLoading(true);

        const fileUrl = new URL(selectedCard.admitCardFile, window.location.origin).href;

        // Google Docs Viewer URL (useful in some mobile/webview environments)
        const googleViewer = `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(fileUrl)}`;

        // Detect Android WebView / APK environments where programmatic downloads often fail
        const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
        const isAndroid = /Android/i.test(ua);
        const isWebView = isAndroid && (/wv|Version\/\d+\.\d+/.test(ua) || !/Chrome/i.test(ua));
        if (isWebView) {
            // Try host app bridge methods commonly exposed in Android WebView APKs
            try {
                if (window.Android && typeof window.Android.downloadFile === 'function') {
                    // prefer Google Viewer link for better rendering/download handling
                    window.Android.downloadFile(googleViewer);
                    setDownloadLoading(false);
                    return;
                }
                if (window.Android && typeof window.Android.open === 'function') {
                    window.Android.open(googleViewer);
                    setDownloadLoading(false);
                    return;
                }
                if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'download', url: googleViewer }));
                    setDownloadLoading(false);
                    return;
                }
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.download) {
                    window.webkit.messageHandlers.download.postMessage({ url: googleViewer });
                    setDownloadLoading(false);
                    return;
                }
            } catch (e) {
                // ignore and fallback
            }

            // Fallback: create an invisible iframe to trigger navigation/download, then navigate as last resort
            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = googleViewer;
                document.body.appendChild(iframe);
                setTimeout(() => {
                    try { document.body.removeChild(iframe); } catch (e) {}
                }, 3000);
            } catch (e) {
                // ignore
            }

            try { window.location.assign(googleViewer); } catch (e) { /* ignore */ }
            setDownloadLoading(false);
            return;
        }

        try {
            const fileName = fileUrl.split('/').pop().split('?')[0] || 'admit-card.pdf';
            const response = await fetch(fileUrl, { mode: 'cors' });
            if (!response.ok) throw new Error('Failed to fetch file');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
        } catch (error) {
            // Final fallback: open the URL in a new tab/window
            try { window.open(fileUrl, '_blank'); } catch (e) { window.location.assign(fileUrl); }
        } finally {
            setDownloadLoading(false);
        }
    };

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
                        <div className="p-0">
                            <AdmitCardSearchSkeleton />
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

                    {(currentPage || pageLoading) && (
                        <div className="mt-4 space-y-3">
                            {pageLoading ? (
                                <div className="p-0">
                                    <AdmitCardSearchSkeleton />
                                </div>
                            ) : (
                                <>
                                    {searchLoading && (
                                        <div className="p-0">
                                            <ListItemsSkeleton count={3} />
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
                                </>
                            )}
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
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center h-[55vh] md:h-[70vh] min-h-[360px]">
                                {selectedCard.admitCardFile.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        src={isMobileDevice ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedCard.admitCardFile)}` : selectedCard.admitCardFile}
                                        className="w-full h-full border-0"
                                        title="Admit Card PDF"
                                    />
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

                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2 w-full">
                            <div className="flex gap-2 w-full sm:w-auto sm:order-1 sm:justify-end">
                                {selectedCard.admitCardFile && (
                                    <button onClick={handleDownload} disabled={downloadLoading} className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                        <Download size={16} /> {downloadLoading ? 'Downloading...' : 'Download'}
                                    </button>
                                )}
                                <Button className="w-full sm:w-auto" variant="secondary" onClick={() => setSelectedCard(null)}>Close</Button>
                            </div>
                        </div>
                    </div>
                )}
            </PopupModel>
        </>
    );
};

export default AdmitCardSearchPage;
