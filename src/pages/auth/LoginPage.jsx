import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/thunk/authThunk';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await dispatch(login({ email, password })).unwrap();
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
            <div className="max-w-md w-full">
                {/* Brand Logo / Welcome */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 mb-6 group transition-transform hover:scale-110">
                        <span className="text-2xl font-black">ZO</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Portal Secure Access
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-slate-800">
                    <form className="space-y-6" onSubmit={submitHandler}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 p-4 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider text-center">
                                {typeof error === 'string' ? error : 'Invalid Credentials'}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                                    Email Identifier
                                </label>
                                <div className="group relative transition-all duration-300">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 transition-all placeholder:text-slate-400"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        Security Key
                                    </label>
                                    <Link to="/forgot-password" size={18} className="text-[10px] font-black text-primary hover:text-primary-dark uppercase tracking-widest">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="group relative transition-all duration-300">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 transition-all placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer group">
                                <input type="checkbox" className="size-4 rounded-md border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" />
                                <span className="ml-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Trust this device</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all duration-200"
                        >
                            {loading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Authorize Entry
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-slate-50 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            No credentials yet?{' '}
                            <Link to="/register" className="text-primary hover:text-primary-dark flex items-center justify-center gap-1.5 mt-2 transition-all hover:gap-2">
                                Register Account <ArrowRight size={14} />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-10 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <ShieldCheck size={14} /> 256-bit SSL
                    </div>
                    <div className="size-1 w-1 bg-slate-300 rounded-full"></div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ISO 27001
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
