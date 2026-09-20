/**
 * StatusPill — one owner for how a ticket status is drawn.
 *
 * The status palette in utils/constants ships light background tints, which
 * look right on a white card and wrong on a dark one. This component picks the
 * tint for the active theme so every list, table and detail view agrees.
 */
import { TICKET_STATUS_CONFIG } from '../../../utils/constants'
import { useDarkMode } from '../../../hooks/useDarkMode'

export default function StatusPill({ status, size = 'md', className = '' }) {
  const dark = useDarkMode()
  const config = typeof status === 'string' ? TICKET_STATUS_CONFIG[status] : status
  if (!config) return null

  const sizing = size === 'sm'
    ? 'text-[9px] px-2 py-0.5'
    : 'text-[10px] px-2.5 py-1'

  return (
    <span
      className={`inline-block ${sizing} font-bold rounded-full uppercase tracking-[0.08em] whitespace-nowrap ${className}`}
      style={{
        color: config.color,
        backgroundColor: dark ? `${config.color}26` : config.bgColor,
      }}
    >
      {config.label}
    </span>
  )
}
