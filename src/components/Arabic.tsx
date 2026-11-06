import type { ReactNode } from 'react'

// Arabic accent text, set in Alexandria. Always marked lang/dir so the browser shapes and
// orders it right-to-left, even inside an English line.
export function Ar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span lang="ar" dir="rtl" className={`ar ${className ?? ''}`.trim()}>
      {children}
    </span>
  )
}
