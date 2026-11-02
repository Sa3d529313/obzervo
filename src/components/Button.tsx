import type { MouseEvent, ReactNode } from 'react'
import { scrollToTarget } from '../lib/scroll'

type Props = {
  href: string
  children: ReactNode
  variant?: 'light' | 'glass'
  arrow?: boolean
}

export function Arrow() {
  return (
    <svg className="btn__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Pill button with a rolling label; in-page anchors go through Lenis.
export function Button({ href, children, variant = 'light', arrow = true }: Props) {
  const onClick = (e: MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      scrollToTarget(href)
    }
  }
  return (
    <a href={href} onClick={onClick} className={`btn btn--${variant} ${variant === 'glass' ? 'glass' : ''}`}>
      <span className="btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {arrow && <Arrow />}
    </a>
  )
}
