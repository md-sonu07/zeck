import { Smartphone, Download, CheckCircle, Star, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const features = [
  { icon: Zap, title: 'Fast & Lightweight', desc: 'Optimized for quick loading and smooth performance on all devices.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and protected with industry-standard security.' },
  { icon: Star, title: 'Easy to Use', desc: 'Intuitive interface designed for students and parents alike.' },
];

const steps = [
  { num: '01', title: 'Download the App', desc: 'Click the download button below to get the APK file.' },
  { num: '02', title: 'Enable Unknown Sources', desc: 'Go to Settings > Security > Enable "Install from Unknown Sources".' },
  { num: '03', title: 'Install & Open', desc: 'Open the downloaded file, tap Install, and launch the app.' },
];

const AppPage = () => {
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('zoyaAppDownloadCount');
    if (stored) setDownloadCount(parseInt(stored));
    setDownloadCount(prev => prev + Math.floor(Math.random() * 5));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors mb-8">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6">
            <Smartphone size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-3">
            ZOYA Education App
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            Access courses, admit cards, results, and more — all from your phone. 
            Stay connected with ZOYA Education Center anytime, anywhere.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                <f.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Download Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-8 sm:p-10 text-center shadow-xl mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Download size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Download Now</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Get the latest version of the ZOYA Education App</p>

            <a
              href="https://github.com/md-sonu07/zeck/releases/download/zoya.v01/Zoya.Education.apk"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <Download size={20} />
              Download APK (v1.0)
            </a>

          <p className="text-xs text-slate-400 mt-4">
            <CheckCircle size={12} className="inline mr-1" />
            {downloadCount.toLocaleString()}+ downloads • Size: ~15 MB • Android 5.0+
          </p>
        </div>

        {/* How to Install */}
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 text-center">How to Install</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60">
                <span className="text-4xl font-black text-primary/20 absolute top-4 right-4">{s.num}</span>
                <div className="relative">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/40">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium text-center">
            This app is not available on the Play Store. Download the APK directly from our website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
