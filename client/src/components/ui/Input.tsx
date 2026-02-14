import React from 'react';

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${className}
        `}
      />
    </div>
  );
};