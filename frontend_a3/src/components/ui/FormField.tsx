'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'url';
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  options = [],
  rows = 4,
  className = ''
}) => {
  const baseClasses = "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
  const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const disabledClasses = "bg-gray-100 text-gray-500 cursor-not-allowed";

  const inputClasses = `${baseClasses} ${error ? errorClasses : ''} ${disabled ? disabledClasses : ''} ${className}`;

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={inputClasses}
          />
        );

      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={inputClasses}
          >
            <option value="">Seleccionar...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className={`block text-sm font-semibold text-gray-700 mb-2 ${required ? 'required' : ''}`}>
        {label}
      </label>
      {renderField()}
      {error && (
        <div className="form-error mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;
