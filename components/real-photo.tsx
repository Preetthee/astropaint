'use client'

import { Camera, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { sfx } from '@/lib/audio'
import type { LevelData } from '@/lib/levels'
import { cn } from '@/lib/utils'
import { Modal } from './modal'

export function RealPhotoModal({
  level,
  open,
  onClose,
}: {
  level: LevelData
  open: boolean
  onClose: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} title={`The real ${level.name}`}>
      <figure className="flex flex-col gap-3">
        <img
          src={level.photo.src || '/placeholder.svg'}
          alt={level.photo.alt}
          className="w-full rounded-2xl object-cover ring-4 ring-border"
        />
        <figcaption className="flex flex-col gap-1 leading-relaxed">
          <span className="font-bold">{level.photo.title}</span>
          <span className="text-sm text-muted-foreground">Image credit: {level.photo.credit}</span>
        </figcaption>
      </figure>
      <p className="rounded-2xl bg-muted p-3 leading-relaxed">
        This is a real photo of {level.name} on Mars. Can you find the parts you colored?
      </p>
      <a
        href={level.photo.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-muted font-bold transition hover:bg-border"
      >
        See it on NASA&apos;s website
        <ExternalLink className="size-4" aria-hidden="true" />
      </a>
    </Modal>
  )
}

export function RealPhotoButton({ level, className }: { level: LevelData; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.click()
          setOpen(true)
        }}
        className={cn(
          'flex h-12 items-center justify-center gap-2 rounded-full bg-muted px-5 font-bold transition hover:bg-border',
          className,
        )}
      >
        <Camera className="size-5 text-accent" aria-hidden="true" />
        Want to see the real picture?
      </button>
      <RealPhotoModal level={level} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
