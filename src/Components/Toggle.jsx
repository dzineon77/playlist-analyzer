import React from 'react';

const Toggle = ({ isToggled, onToggle }) => {
  return (
    <>
    <div className="relative inline-block mb-4">
      <input
        type="checkbox"
        id="toggle"
        checked={isToggled}
        onChange={onToggle}
        className="peer sr-only"
      />
      <label
        htmlFor="toggle"
        className="relative flex items-center w-48 sm:w-64 cursor-pointer rounded-[20px] border-2 sm:border-4 border-[#343434] bg-[#343434] font-bold"
      >
        {/* Sliding background */}
        <div
          className={`absolute h-full w-1/2 rounded-[16px] bg-white transition-all duration-300 ease-in-out ${
            isToggled ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        
        {/* Text elements */}
        <div className={`relative z-10 flex w-full`}>
          <span
            className={`flex-1 p-1 sm:p-2 text-center text-sm sm:text-base transition-colors duration-300 ${
              isToggled ? 'text-white' : 'text-[#343434]'
            }`}
          >
            Search Songs
          </span>
          <span
            className={`flex-1 p-1 sm:p-2 text-center text-sm sm:text-base transition-colors duration-300 ${
              isToggled ? 'text-[#343434]' : 'text-white'
            }`}
          >
            Your Playlists
          </span>
        </div>
      </label>
    </div>
    </>
  );
};

export default Toggle;