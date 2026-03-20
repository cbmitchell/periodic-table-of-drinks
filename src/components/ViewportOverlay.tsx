import { createPortal } from 'react-dom'

interface ViewportOverlayProps {
  children: React.ReactNode
}

export function ViewportOverlay({ children }: ViewportOverlayProps) {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1301,
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
