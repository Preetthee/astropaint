'use client'

import { Detail, IllustrationFrame, Region } from '@/components/coloring/illustration-kit'
import type { IllustrationProps } from '@/components/coloring/illustration-kit'

type ArtProps = Omit<IllustrationProps, 'title'>

export function IngenuityArt(props: ArtProps) {
  return (
    <IllustrationFrame {...props} title="Ingenuity Mars helicopter coloring page">
      <Region id="sky"><path d="M0 0H800V480H0z" /></Region>
      <Region id="ground"><path d="M0 470Q190 430 400 468T800 450V600H0z" /></Region>
      <Region id="wheel1"><path d="M250 190H550V208H250z" /></Region>
      <Region id="wheel2"><path d="M320 222H480V238H320z" /></Region>
      <Region id="wheel3"><path d="M365 300l-52 88 14 9 63-87z" /></Region>
      <Region id="wheel4"><path d="M435 300l52 88-14 9-63-87z" /></Region>
      <Region id="wheel5"><path d="M365 300l-22 101 16 4 33-99z" /></Region>
      <Region id="wheel6"><path d="M435 300l22 101-16 4-33-99z" /></Region>
      <Region id="vehicle"><path d="M345 254Q345 244 360 244H440Q455 244 455 254V322H345z" /></Region>
      <Region id="instrument"><path d="M365 302a15 15 0 1 0 30 0a15 15 0 1 0-30 0" /></Region>
      <Region id="antenna"><path d="M385 220H415V242H385z" /></Region>
      <Detail>
        <path d="M0 470Q190 430 400 468T800 450M270 199h260M340 230h120M380 176v14m-20-14h40M365 320l-36 73m106-73 36 73" />
        <circle cx="380" cy="302" r="4" /><circle cx="385" cy="230" r="4" />
        <path d="M370 258h60m-60 10h60m-60 10h60" />
      </Detail>
    </IllustrationFrame>
  )
}

export function OpportunityArt(props: ArtProps) {
  return (
    <IllustrationFrame {...props} title="Opportunity Mars rover coloring page">
      <Region id="sky"><path d="M0 0H800V390H0z" /></Region>
      <Region id="ground"><path d="M0 380Q180 355 360 386T800 372V600H0z" /></Region>
      <Region id="wheel1"><circle cx="250" cy="400" r="35" /></Region>
      <Region id="wheel2"><circle cx="350" cy="400" r="35" /></Region>
      <Region id="wheel3"><circle cx="450" cy="400" r="35" /></Region>
      <Region id="wheel4"><circle cx="500" cy="400" r="35" /></Region>
      <Region id="wheel5"><circle cx="600" cy="400" r="35" /></Region>
      <Region id="wheel6"><circle cx="700" cy="400" r="35" /></Region>
      <Region id="vehicle"><path d="M190 320Q190 302 210 302H550Q570 302 580 320L605 370H180z" /></Region>
      <Region id="instrument"><path d="M350 180H445L460 300H335z" /></Region>
      <Region id="antenna"><path d="M490 255Q545 205 590 255Q545 305 490 255z" /></Region>
      <Detail>
        <path d="M0 380Q180 355 360 386T800 372M220 350h355M350 312v-36h115v36M372 276l-20-44m75 44 25-50" />
        <circle cx="398" cy="220" r="24" /><circle cx="398" cy="220" r="8" />
        {[250, 350, 450, 500, 600, 700].map((x) => <path key={x} d={`M${x} 400l-14-18m14 18 14-18`} />)}
        <path d="M500 255q45-35 90 0m-90 0q45 35 90 0M220 320h310m-300 12h280" />
      </Detail>
    </IllustrationFrame>
  )
}

export function SojournerArt(props: ArtProps) {
  return (
    <IllustrationFrame {...props} title="Sojourner Mars rover coloring page">
      <Region id="sky"><path d="M0 0H800V385H0z" /></Region>
      <Region id="ground"><path d="M0 376Q200 350 400 382T800 370V600H0z" /></Region>
      <Region id="wheel1"><circle cx="280" cy="410" r="31" /></Region>
      <Region id="wheel2"><circle cx="380" cy="410" r="31" /></Region>
      <Region id="wheel3"><circle cx="480" cy="410" r="31" /></Region>
      <Region id="wheel4"><circle cx="315" cy="390" r="27" /></Region>
      <Region id="wheel5"><circle cx="415" cy="390" r="27" /></Region>
      <Region id="wheel6"><circle cx="515" cy="390" r="27" /></Region>
      <Region id="vehicle"><path d="M270 320Q270 305 288 305H472Q490 305 490 320V370H270z" /></Region>
      <Region id="instrument"><path d="M330 240H425L440 300H315z" /></Region>
      <Region id="antenna"><path d="M455 270l70-42v68l-70-20z" /></Region>
      <Detail>
        <path d="M0 376Q200 350 400 382T800 370M300 350h160m-10-48v-28m-98 28v-34" />
        <path d="M345 262h55m-55 10h55m-55 10h55M455 270l70-42m-70 42 70 26" />
        {[290, 380, 470].map((x) => <path key={x} d={`M${x} 410l-13-13m13 13 13-13`} />)}
        <path d="M275 315h210m-210 15h210M180 340v-65h55v65m-62-65h69m-42-14v14m-14-14h28" />
        <circle cx="207" cy="260" r="12" />
      </Detail>
    </IllustrationFrame>
  )
}

export function LunarRoverArt(props: ArtProps) {
  return (
    <IllustrationFrame {...props} title="Apollo Lunar Roving Vehicle coloring page">
      <Region id="sky"><path d="M0 0H800V390H0z" /></Region>
      <Region id="ground"><path d="M0 382Q190 355 400 390T800 370V600H0z" /></Region>
      <Region id="wheel1"><path d="M210 372a35 35 0 1 0 70 0a35 35 0 1 0-70 0" /></Region>
      <Region id="wheel2"><path d="M520 372a35 35 0 1 0 70 0a35 35 0 1 0-70 0" /></Region>
      <Region id="wheel3"><path d="M255 420a35 35 0 1 0 70 0a35 35 0 1 0-70 0" /></Region>
      <Region id="wheel4"><path d="M475 420a35 35 0 1 0 70 0a35 35 0 1 0-70 0" /></Region>
      <Region id="wheel5"><path d="M320 270H390V330H320z" /></Region>
      <Region id="wheel6"><path d="M410 270H480V330H410z" /></Region>
      <Region id="vehicle"><path d="M240 335L310 320H500L560 350L535 378H270z" /></Region>
      <Region id="instrument"><path d="M360 314H430L420 340H370z" /></Region>
      <Region id="antenna"><path d="M510 260Q560 215 610 260Q560 305 510 260z" /></Region>
      <Detail>
        <path d="M0 382Q190 355 400 390T800 370M245 355l-20 17m80-52 35 75m170-75-35 75m60-25 50 35m-295-30 40 36m200-32 20-10M250 350h290" />
        <path d="M330 268q25-45 50 0m40 0q25-45 50 0M340 285h50m-50 12h50m35-12h50m-50 12h50M390 315l-15-42m58 42 16-42" />
        <circle cx="360" cy="300" r="11" /><circle cx="450" cy="300" r="11" />
        <path d="M530 260q30-28 60 0m-60 0q30 28 60 0" />
        {[245, 555, 290, 510].map((x, index) => {
          const y = index < 2 ? 372 : 420
          return <path key={`${x}-${y}`} d={`M${x} ${y}l-13-14m13 14 13-14`} />
        })}
      </Detail>
    </IllustrationFrame>
  )
}
