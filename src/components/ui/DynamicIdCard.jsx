import React from 'react';

const DynamicIdCard = ({ person }) => {
    if (!person) return null;

    const { type, data } = person;

    // Format data based on type
    const isManual = type === 'manual';

    const name = isManual ? data.fullName : (type === 'staff' ? data.name : data.personalInfo?.fullName);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return 'N/A';
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    const dob = isManual ? formatDate(data.dob) : (type === 'staff' ? 'N/A' : formatDate(data.personalInfo?.dateOfBirth));
    const roleLabel = isManual ? (data.type === 'staff' ? 'DESIGNATION' : 'COURSE') : (type === 'staff' ? 'DESIGNATION' : 'COURSE');
    const roleValue = isManual ? data.roleOrCourse : (type === 'staff' ? 'Admin/Staff' : (data.customCourse || data.course?.title || 'N/A'));
    const mobile = isManual ? data.mobile : (type === 'staff' ? (data.phone || 'N/A') : (data.contactInfo?.mobile || 'N/A'));

    // Address logic
    const addressInfo = isManual ? data.address : (type === 'staff' ? 'Zoya Education Centre' :
        (data.addressInfo?.permanent ?
            `${data.addressInfo.permanent.addressLine}, ${data.addressInfo.permanent.city}, ${data.addressInfo.permanent.state}-${data.addressInfo.permanent.pincode}`
            : 'N/A'
        ));

    // Default profile image if not available
    const defaultAvatar = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='5'/%3E%3Cpath d='M20 21a8 8 0 0 0-16 0'/%3E%3C/svg%3E";

    const profileImg = isManual
        ? (data.profileImage || defaultAvatar)
        : (type === 'staff'
            ? (data.avatar || defaultAvatar)
            : (data.documents?.find(d => d.name === 'Passport Size Photo')?.files[0] || defaultAvatar));

    const isStudent = (isManual && data.type === 'student') || (!isManual && type !== 'staff');

    if (isStudent) {
        return (
            <div style={{
                width: '380px',
                height: '580px',
                backgroundColor: 'white',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: 'Arial, sans-serif'
            }}>
                {/* Background Image */}
                <img src="/idcard/idcardtemplate.jpg" alt="background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} crossOrigin="anonymous" />

                {/* Profile Picture */}
                <div style={{ position: 'absolute', top: '158px', left: '50%', transform: 'translateX(-50%)', width: '135px', height: '135px', borderRadius: '50%', overflow: 'hidden', border: '3px solid white', backgroundColor: 'white', zIndex: 1 }}>
                    <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                </div>

                {/* Name */}
                <div style={{ position: 'absolute', top: '294px', width: '100%', textAlign: 'center', zIndex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0B3A7B', textTransform: 'uppercase' }}>{name}</h2>
                </div>

                {/* Details container */}
                <div style={{ position: 'absolute', top: '332px', left: '45px', right: '50px', zIndex: 1 }}>

                    {/* Course Row */}
                    <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <div style={{ width: '80px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>COURSE</div>
                        <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                        <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B', textTransform: 'uppercase' }}>{roleValue}</div>
                    </div>

                    {isManual && data.college && (
                        <div style={{ display: 'flex', marginBottom: '8px' }}>
                            <div style={{ width: '80px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>College</div>
                            <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                            <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B', textTransform: 'uppercase' }}>{data.college}</div>
                        </div>
                    )}

                    {isManual && data.session && (
                        <div style={{ display: 'flex', marginBottom: '8px' }}>
                            <div style={{ width: '80px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Session</div>
                            <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                            <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B', textTransform: 'uppercase' }}>{data.session}</div>
                        </div>
                    )}

                    {/* DOB Row */}
                    <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <div style={{ width: '80px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>D.O.B.</div>
                        <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                        <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B' }}>{dob}</div>
                    </div>

                    {/* Mobile Row */}
                    <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <div style={{ width: '80px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>MOB.</div>
                        <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                        <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B' }}>{mobile}</div>
                    </div>

                    {/* Address Row */}
                    <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <div style={{ width: '80px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>ADDRESS</div>
                        <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                        <div style={{ flex: 1, fontWeight: 'bold', fontSize: '12px', color: '#0B3A7B', lineHeight: '1.2' }}>{addressInfo}</div>
                    </div>
                </div>

                {/* Shop Address at bottom next to map pin */}
                <div style={{ position: 'absolute', bottom: '29px', left: '60px', right: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.4px', lineHeight: '14px', zIndex: 1 }}>
                    Zoya Education Centre & Trust <br /> Kursakanta Main Road, Araria
                </div>
            </div>
        );
    }

    // Staff Layout
    return (
        <div style={{
            width: '380px',
            height: '580px',
            backgroundColor: 'white',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Background Image */}
            <img src="/idcard/idcardtemplate.jpg" alt="background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} crossOrigin="anonymous" />

            {/* Profile Picture */}
            <div style={{ position: 'absolute', top: '158px', left: '50%', transform: 'translateX(-50%)', width: '135px', height: '135px', borderRadius: '50%', overflow: 'hidden', border: '3px solid white', backgroundColor: 'white', zIndex: 1 }}>
                <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>

            {/* Name */}
            <div style={{ position: 'absolute', top: '294px', width: '100%', textAlign: 'center', zIndex: 1 }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0B3A7B', textTransform: 'uppercase' }}>{name}</h2>
            </div>

            {/* Details container */}
            <div style={{ position: 'absolute', top: '332px', left: '45px', right: '50px', zIndex: 1 }}>

                {/* Designation Row */}
                <div style={{ display: 'flex', marginBottom: '12px' }}>
                    <div style={{ width: '100px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>DESIGNATION</div>
                    <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B', textTransform: 'uppercase' }}>{roleValue}</div>
                </div>

                {/* DOB Row */}
                <div style={{ display: 'flex', marginBottom: '12px' }}>
                    <div style={{ width: '100px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>D.O.B.</div>
                    <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B' }}>{dob}</div>
                </div>

                {/* Mobile Row */}
                <div style={{ display: 'flex', marginBottom: '12px' }}>
                    <div style={{ width: '100px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>MOBILE</div>
                    <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px', color: '#0B3A7B' }}>{mobile}</div>
                </div>

                {/* Address Row */}
                <div style={{ display: 'flex', marginBottom: '12px' }}>
                    <div style={{ width: '100px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>ADDRESS</div>
                    <div style={{ width: '15px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>:</div>
                    <div style={{ flex: 1, fontWeight: 'bold', fontSize: '12px', color: '#0B3A7B', lineHeight: '1.2' }}>{addressInfo}</div>
                </div>
            </div>

            {/* Shop Address at bottom next to map pin */}
            <div style={{ position: 'absolute', bottom: '29px', left: '60px', right: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.4px', lineHeight: '14px', zIndex: 1 }}>
                Zoya Education Centre & Trust <br /> Kursakanta Main Road, Araria
            </div>
        </div>
    );
};

export default DynamicIdCard;
