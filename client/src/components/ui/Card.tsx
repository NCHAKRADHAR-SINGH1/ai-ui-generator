import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'bordered';
}

const variantClasses = {
  default: 'bg-white border border-gray-200',
  minimal: 'bg-gray-50 border-none',
  bordered: 'bg-white border-2 border-gray-300'
};

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  variant = 'default'
}) => {
  return (
    <div className={`${variantClasses[variant]} rounded-lg p-4 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          {title}
        </h3>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};