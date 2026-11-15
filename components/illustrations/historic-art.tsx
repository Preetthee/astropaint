'use client'

import { Detail, IllustrationFrame, Region } from '@/components/coloring/illustration-kit'
import type { IllustrationProps } from '@/components/coloring/illustration-kit'

/** Simple, colorable vehicle portrait used for the historical explorer levels. */
export function HistoricArt(props: Omit<IllustrationProps, 'title'>) {
  return (
    <IllustrationFrame {...props} title="Historic space explorer coloring page">
      <Region id="sky"><path d="M0 0H800V380H0z" /></Region>
      <Region id="ground"><path d="M0 365Q180 335 360 370T800 355V600H0z" /></Region>
      <Region id="wheel1"><circle cx="245" cy="395" r="48" /></Region>
      <Region id="wheel2"><circle cx="365" cy="395" r="48" /></Region>
      <Region id="wheel3"><circle cx="485" cy="395" r="48" /></Region>
      <Region id="wheel4"><circle cx="245" cy="395" r="23" /></Region>
      <Region id="wheel5"><circle cx="365" cy="395" r="23" /></Region>
      <Region id="wheel6"><circle cx="485" cy="395" r="23" /></Region>
      <Region id="vehicle"><path d="M190 280Q190 262 210 262H520Q548 262 560 286L584 350H180z" /></Region>
      <Region id="instrument"><path d="M295 145H385L402 260H280z" /></Region>
      <Region id="antenna"><path d="M560 250Q620 215 650 250Q622 279 560 263z" /></Region>
      <Detail>
        <path d="M0 365Q180 335 360 370T800 355M200 350H560M245 395l-18-18m18 18 18-18m102 18-18-18m18 18 18-18m102 18-18-18m18 18 18-18" />
        <path d="M335 145V100M320 100h30m-115 180h280M250 300h230" />
        <circle cx="340" cy="198" r="18" /><circle cx="340" cy="198" r="7" />
        <path d="M575 256l65-28m-65 28 65 18" />
      </Detail>
    </IllustrationFrame>
  )
}
