import React, { useState, useEffect } from 'react';

const Switcher1 = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    document.documentElement.className = isChecked ? 'dark' : 'light';
  }, [isChecked]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className='flex cursor-pointer select-none items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          className='sr-only'
        />
        <div className='block h-8 w-14 rounded-full bg-second'></div>
        <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${isChecked ? 'translate-x-6' : ''}`}></div>
      </div>
      <span className='ml-3 text-sm font-medium text-primary dark:text-second'>Mode</span>
    </label>
  );
};

export default Switcher1;