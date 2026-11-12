'use client'

import {
  Detail,
  IllustrationFrame,
  OUTLINE,
  Region,
  TubeRegion,
  Wheel,
  hexagonPoints,
  type IllustrationProps,
} from '@/components/coloring/illustration-kit'

/**
 * Perseverance (Mars 2020) side view, front to the right.
 * Placement follows NASA references (see lib/levels/perseverance.ts):
 * - Remote sensing mast at the front of the deck; head turned toward the viewer
 *   showing SuperCam's large round opening with the two Mastcam-Z boxes beneath.
 * - Hexagonal X-band high-gain antenna mid-aft on the deck.
 * - MMRTG power source angled off the aft end.
 * - RIMFAX under the aft end of the body; MOXIE inside the front of the body
 *   (drawn as a dashed "peek window").
 * - 5-joint robotic arm on the front; turret carries coring drill, PIXL, SHERLOC.
 * - Six wheels on rocker-bogie suspension (three visible from the side).
 */
export function PerseveranceArt(props: Omit<IllustrationProps, 'title'>) {
  return (
    <IllustrationFrame {...props} title="Coloring page: NASA Perseverance Mars rover in Jezero Crater">
      {/* Scene: Jezero Crater */}
      <Region id="sky">
        <rect x={2} y={2} width={796} height={596} rx={24} />
      </Region>
      <Region id="rim">
        <path d="M2 446 Q 110 405 240 428 Q 400 398 560 425 Q 690 405 798 430 L 798 520 L 2 520 Z" />
      </Region>
      <Region id="ground">
        <path d="M2 478 Q 200 456 400 472 Q 600 488 798 466 L 798 574 Q 798 598 774 598 L 26 598 Q 2 598 2 574 Z" />
      </Region>
      <Detail>
        <ellipse cx={70} cy={520} rx={16} ry={6} />
        <ellipse cx={120} cy={566} rx={22} ry={7} />
        <ellipse cx={300} cy={580} rx={14} ry={5} />
        <ellipse cx={470} cy={574} rx={18} ry={6} />
        <ellipse cx={610} cy={500} rx={12} ry={4} />
        <path d="M30 498 Q 60 492 90 497" />
        <path d="M720 486 Q 750 480 780 485" />
      </Detail>
      <ellipse cx={390} cy={548} rx={270} ry={14} fill={OUTLINE} opacity={0.12} pointerEvents="none" />

      <Region id="rock">
        <path d="M640 552 Q 648 522 688 518 Q 736 512 762 538 Q 772 552 760 560 L 648 562 Z" />
      </Region>
      <Detail>
        <path d="M668 540 Q 690 532 712 538" />
        <path d="M724 528 Q 740 530 748 542" />
      </Detail>

      {/* Power source (MMRTG) angled off the aft end */}
      <g transform="rotate(28 205 352)">
        <Region id="mmrtg">
          <rect x={120} y={322} width={84} height={60} rx={8} />
          <rect x={108} y={337} width={100} height={30} rx={13} />
        </Region>
        <Detail>
          {[132, 146, 160, 174, 188].map((x) => (
            <g key={x}>
              <path d={`M${x} 323 L${x} 337`} />
              <path d={`M${x} 367 L${x} 381`} />
            </g>
          ))}
        </Detail>
      </g>

      {/* High-gain antenna */}
      <Region id="hga">
        <rect x={294} y={300} width={12} height={38} rx={3} />
        <polygon points={hexagonPoints(300, 268, 34)} />
      </Region>
      <Detail>
        <polygon points={hexagonPoints(300, 268, 21)} />
        <circle cx={300} cy={268} r={4} />
      </Detail>

      {/* Remote sensing mast */}
      <TubeRegion id="mast" d="M501 338 L501 208" width={14} />

      {/* Mast head: SuperCam */}
      <Region id="supercam">
        <rect x={444} y={148} width={114} height={58} rx={10} />
      </Region>
      <Detail>
        <circle cx={501} cy={177} r={21} />
        <circle cx={501} cy={177} r={13} />
        <circle cx={501} cy={177} r={5} />
        <path d="M456 160 L470 160" />
        <path d="M532 160 L546 160" />
      </Detail>

      {/* Mastcam-Z pair */}
      <Region id="mastcamz">
        <rect x={450} y={210} width={40} height={28} rx={5} />
        <rect x={512} y={210} width={40} height={28} rx={5} />
      </Region>
      <Detail>
        <circle cx={470} cy={224} r={9} />
        <circle cx={470} cy={224} r={3.5} />
        <circle cx={532} cy={224} r={9} />
        <circle cx={532} cy={224} r={3.5} />
      </Detail>

      {/* Body (warm electronics box) and deck */}
      <Region id="deck">
        <rect x={200} y={336} width={352} height={16} rx={5} />
      </Region>
      <Region id="body">
        <path d="M214 352 L536 352 L552 382 L538 440 L226 440 L208 410 Z" />
      </Region>
      <Detail>
        <path d="M226 396 L420 396" />
        <path d="M300 352 L300 440" />
        <rect x={238} y={362} width={44} height={24} rx={4} />
        <circle cx={545} cy={393} r={4} />
        <circle cx={543} cy={410} r={4} />
      </Detail>

      {/* MOXIE: inside the front of the body */}
      <Region id="moxie">
        <rect x={440} y={364} width={82} height={60} rx={8} strokeDasharray="7 5" />
      </Region>
      <Detail>
        <rect x={454} y={378} width={54} height={32} rx={5} />
        <path d="M462 394 L500 394" />
        <path d="M481 378 L481 368" />
      </Detail>

      {/* RIMFAX under the aft body */}
      <Region id="rimfax">
        <rect x={232} y={440} width={54} height={15} rx={4} />
      </Region>
      <Detail>
        <path d="M244 444 L244 451" />
        <path d="M259 444 L259 451" />
        <path d="M274 444 L274 451" />
      </Detail>

      {/* Rocker-bogie suspension */}
      <TubeRegion id="bogie" d="M375 499 L302 462 L190 499" width={12} />
      <TubeRegion id="rocker" d="M560 499 L452 420 L302 462" width={12} />
      <Detail width={3}>
        <circle cx={452} cy={420} r={7} />
        <circle cx={302} cy={462} r={7} />
      </Detail>

      <Wheel id="wheel-rear" cx={190} cy={499} r={46} variant="perseverance" />
      <Wheel id="wheel-middle" cx={375} cy={499} r={46} variant="perseverance" />
      <Wheel id="wheel-front" cx={560} cy={499} r={46} variant="perseverance" />

      {/* Robotic arm: shoulder, elbow, wrist */}
      <TubeRegion id="arm-upper" d="M538 402 L640 318" width={16} />
      <TubeRegion id="arm-lower" d="M640 318 L694 428" width={14} />
      <Detail width={3}>
        <circle cx={538} cy={402} r={10} />
        <circle cx={640} cy={318} r={11} />
      </Detail>

      {/* Turret tools */}
      <Region id="drill">
        <rect x={688} y={466} width={16} height={56} rx={4} />
      </Region>
      <Detail>
        <path d="M690 478 L702 486" />
        <path d="M690 490 L702 498" />
        <path d="M690 502 L702 510" />
      </Detail>
      <Region id="sherloc">
        <rect x={640} y={436} width={32} height={40} rx={6} />
      </Region>
      <Detail>
        <circle cx={656} cy={464} r={6} />
      </Detail>
      <Region id="pixl">
        <rect x={722} y={438} width={42} height={32} rx={6} />
      </Region>
      <Detail>
        <path d="M730 470 L726 480" />
        <path d="M743 470 L743 481" />
        <path d="M756 470 L760 480" />
        <circle cx={743} cy={452} r={5} />
      </Detail>
      <Region id="turret">
        <circle cx={696} cy={455} r={27} />
      </Region>
      <Detail>
        <circle cx={696} cy={455} r={12} />
      </Detail>
    </IllustrationFrame>
  )
}
