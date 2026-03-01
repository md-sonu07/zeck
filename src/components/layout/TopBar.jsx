import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Clock, Megaphone } from 'lucide-react';
import { fetchContactSettings } from '../../store/thunk/contactThunk';

const TopBar = () => {
    const dispatch = useDispatch();
    const { settings: contactSettings } = useSelector((state) => state.contact);

    useEffect(() => {
        if (!contactSettings) {
            dispatch(fetchContactSettings());
        }
    }, [dispatch, contactSettings]);

    const email = contactSettings?.email || 'zoyaeductioncenter@gmail.com';
    const workingHours = contactSettings?.workingHours || '9AM – 6PM';

    return (
        <div className="bg-primary text-white/90 text-[11px] py-1.5 px-4 border-b border-primary-dark/20">
            <div className="max-w-[1200px] mx-auto flex justify-between items-center font-medium tracking-wide">
                <div className="flex items-center gap-2">
                    <Megaphone size={13} className="text-blue-200" />
                    <span>Welcome Zoya Education Centre</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-1.5 opacity-85">
                        <Clock size={13} />
                        <span>{workingHours}</span>
                    </div>
                    <a href={`mailto:${email}`} className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
                        <Mail size={13} className="opacity-80" />
                        <span>{email}</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
