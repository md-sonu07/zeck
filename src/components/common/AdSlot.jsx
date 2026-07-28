import { useEffect, useRef } from 'react';

const AdSlot = ({ adSlot, format = 'auto', className = '', style = {} }) => {
  const adRef = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!adSlot || pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense push error:', e);
    }
  }, [adSlot]);

  if (!adSlot) return null;

  return (
    <div className={`ad-container overflow-hidden ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7611215024260909"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
