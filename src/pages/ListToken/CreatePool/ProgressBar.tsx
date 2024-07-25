import React from 'react';

type ProgressBarProps = {
  step: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
  const steps = 4;
  const progress = (step / steps) * 100;

  return (
    <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
      <div
        className='bg-blue-600 h-2.5 rounded-full'
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
