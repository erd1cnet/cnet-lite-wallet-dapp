import React, { useEffect, useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const DEFAULT_SVG_URL = '/assets/img/default.svg';

  useEffect(() => {
    setImageSrc(src);
    setLoading(true);
  }, [src]);

  return (
    <img
      src={loading ? DEFAULT_SVG_URL : imageSrc}
      alt={alt}
      className={className || 'w-6 h-6 mr-2'}
      onLoad={() => setLoading(false)}
      onError={() => setImageSrc(DEFAULT_SVG_URL)}
    />
  );
};

export default ImageWithFallback;
