import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initTheme } from './store/slice/themeSlice';
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomBar from './components/layout/MobileBottomBar';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdminRoute) {
    return <AppRoutes />;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col transition-colors duration-300 pb-16 md:pb-0">
      <TopBar />
      {/* Sticky Header & Navbar Wrapper */}
      <div className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:pb-2">
          <Header />
          <Navbar />
        </div>
      </div>

      <main className="grow">
        <AppRoutes />
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700' }} />
      <AppContent />
    </Router>
  );
}

export default App;
