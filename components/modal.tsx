'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-labelledby="modal-title"
      className="m-auto w-[min(92vw,34rem)] rounded-3xl border-4 border-border bg-card p-0 text-card-foreground shadow-2xl"
    >
      {open && (
        <div className="flex flex-col gap-5 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="modal-title" className="text-2xl font-semibold text-balance md:text-3xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-border"
            >
              <X className="size-6" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
