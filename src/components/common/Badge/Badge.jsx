/**
 * Badge — Warm Palette Redesign
 */
export default function Badge({
  children,
  variant = 'default',
  color,
  bgColor,
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-mist-light text-ink/50',
    pending: 'bg-[#FFF3E0] text-[#ED6C02]',
    'under-review': 'bg-[#E3F2FD] text-[#1976D2]',
    'action-taken': 'bg-[#F3E5F5] text-[#7B1FA2]',
    resolved: 'bg-[#E8F5E9] text-[#2E7D32]',
    escalated: 'bg-red-50 text-[#D32F2F]',
    closed: 'bg-mist-light text-ink/35',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1 text-[12px]',
  }

  const customStyle = color && bgColor ? { color, backgroundColor: bgColor } : {}

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${customStyle ? '' : variants[variant] || variants.default} ${sizes[size]} ${className}`}
      style={customStyle}
      role="status"
    >
      {children}
    </span>
  )
}
