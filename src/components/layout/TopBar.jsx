import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Clock, Megaphone, Phone } from 'lucide-react';
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
    const phoneNo = contactSettings?.phoneNo || '+91 8092288344';

    return (
        <div className="bg-primary text-white/90 text-[11px] py-1.5 px-4 border-b border-primary-dark/20">
            <div className="max-w-[1200px] mx-auto flex justify-between items-center font-medium tracking-wide">
                <div className="flex items-center gap-2">
                    <Megaphone size={13} className="text-blue-200" />
                    <span className="truncate max-w-[200px] sm:max-w-none">ज़ोया एजुकेशन सेंटर में आपका स्वागत है। शिक्षा ही सफलता की कुंजी है।</span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="hidden md:flex items-center gap-1.5 opacity-85">
                        <Clock size={13} />
                        <span>{workingHours}</span>
                    </div>
                    <a href={`tel:${phoneNo}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <Phone size={13} className="opacity-80" />
                        <span>{phoneNo}</span>
                    </a>
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
