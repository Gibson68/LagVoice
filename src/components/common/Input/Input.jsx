/**
 * Input Component
 * Form input with label, error state, and UNILAG focus styling
 */
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    id,
    type = 'text',
    placeholder,
    required = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
          {required && <span className="text-status-escalated ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`
          w-full px-3 py-2.5 text-sm rounded-lg border transition-colors duration-200
          bg-white text-text-primary placeholder:text-text-secondary
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-50 disabled:text-text-secondary disabled:cursor-not-allowed
          ${
            error
              ? 'border-status-escalated focus:ring-status-escalated/30 focus:border-status-escalated'
              : 'border-border focus:ring-maroon/30 focus:border-maroon'
          }
        `}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-status-escalated flex items-center gap-1" role="alert">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-sm text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  )
})

export default Input
