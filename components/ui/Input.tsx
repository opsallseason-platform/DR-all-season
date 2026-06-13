/**
 * INPUT COMPONENT
 * Caribbean Design System
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = cn(
      'w-full px-4 py-2.5',
      'bg-white border-2 border-[#E2E8F0]',
      'rounded-md text-[#1A2A3A]',
      'placeholder:text-[#4A5568]/50',
      'transition-all duration-200',
      'focus:outline-none focus:border-[#00CED1] focus:ring-2 focus:ring-[#00CED1]/20',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#E2E8F0]',
      error && 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]/20'
    );

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#1A2A3A]">
            {label}
          </label>
        )}
        <input ref={ref} type={type} id={inputId} className={cn(baseStyles, className)} {...props} />
        {error && (
          <p className="text-sm text-[#E74C3C] flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && <p className="text-sm text-[#4A5568]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };