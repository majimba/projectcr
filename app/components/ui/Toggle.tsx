'use client';

import { useState } from 'react';

interface ToggleProps {
  label?: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Toggle({ label, description, defaultChecked = false, onChange }: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {label && (
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        )}
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1173d4] focus:ring-offset-2 dark:ring-offset-[#101922] ${
          checked ? 'bg-[#1173d4]' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
