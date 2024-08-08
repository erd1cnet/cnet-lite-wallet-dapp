import React, { useState, useEffect } from 'react';
import { DEFAULT_SVG_URL } from 'config';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className || 'w-6 h-6 mr-2'}
      onError={() => setImageSrc(DEFAULT_SVG_URL)}
    />
  );
};

export default ImageWithFallback;
