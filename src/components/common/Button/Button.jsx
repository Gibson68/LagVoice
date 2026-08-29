/**
 * Button — Warm Palette Redesign
 */
import { forwardRef } from 'react'

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-maroon text-white hover:bg-maroon-dark focus-visible:ring-maroon active:bg-maroon-deep',
    secondary: 'bg-gold text-white hover:bg-gold-light focus-visible:ring-gold active:bg-gold-dark',
    ghost: 'bg-transparent text-maroon border border-maroon/30 hover:bg-maroon-light focus-visible:ring-maroon',
    danger: 'bg-escalated text-white hover:bg-red-700 focus-visible:ring-escalated',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-4 py-2.5 text-[13px]',
    lg: 'px-6 py-3 text-sm',
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
})

export default Button
