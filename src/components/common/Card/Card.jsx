/**
 * Card — Warm Palette Redesign
 */
export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  padding = true,
  hover = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        bg-paper rounded-xl border border-mist/60
        ${padding ? 'p-5 lg:p-6' : ''}
        ${hover ? 'hover:shadow-sm hover:border-mist transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-baseline justify-between mb-5">
          <div>
            {title && <h3 className="text-lg font-bold text-ink">{title}</h3>}
            {subtitle && <p className="text-[12px] text-ink/35 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  )
}
