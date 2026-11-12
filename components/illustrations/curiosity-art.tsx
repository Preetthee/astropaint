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
 * Curiosity (Mars Science Laboratory) side view, front to the right.
 * Based on NASA references (see lib/levels/curiosity.ts):
 * - Mast head turned toward the viewer: ChemCam's round telescope on the
 *   "forehead", Mastcam below. Mastcam's two eyes differ in size: the
 *   100 mm right eye (viewer's left) is larger than the 34 mm left eye.
 * - REMS weather booms on the mast "neck".
 * - RAD on the deck pointing toward the sky; hexagonal high-gain antenna.
 * - SAM inside the front of the body (dashed "peek window"); DAN box aft.
 * - Arm raised forward; turret holds the drill, MAHLI camera and APXS.
 * - Chevron-tread aluminum wheels on rocker-bogie suspension.
 * - Background: Mount Sharp, the layered mountain inside Gale Crater.
 */
export function CuriosityArt(props: Omit<IllustrationProps, 'title'>) {
  return (
    <IllustrationFrame {...props} title="Coloring page: NASA Curiosity Mars rover in Gale Crater near Mount Sharp">
      <Region id="sky">
        <rect x={2} y={2} width={796} height={596} rx={24} />
      </Region>
      <Region id="mountain">
        <path d="M2 470 L 40 420 Q 90 360 140 330 Q 180 300 215 296 Q 250 300 285 335 L 330 372 Q 370 400 420 430 L 480 470 Z" />
      </Region>
      <Detail>
        <path d="M112 358 Q 210 348 312 362" />
        <path d="M70 396 Q 220 384 362 397" />
        <path d="M24 434 Q 220 420 420 433" />
      </Detail>
      <Region id="ground">
        <path d="M2 476 Q 220 462 420 474 Q 620 486 798 470 L 798 574 Q 798 598 774 598 L 26 598 Q 2 598 2 574 Z" />
      </Region>
      <Detail>
        <ellipse cx={90} cy={530} rx={20} ry={6} />
        <ellipse cx={260} cy={578} rx={16} ry={5} />
        <ellipse cx={480} cy={572} rx={22} ry={7} />
        <ellipse cx={700} cy={540} rx={26} ry={8} />
        <ellipse cx={760} cy={510} rx={12} ry={4} />
        <path d="M600 520 Q 630 512 660 518" />
      </Detail>
      <ellipse cx={380} cy={550} rx={265} ry={14} fill={OUTLINE} opacity={0.12} pointerEvents="none" />

      {/* MMRTG power source */}
      <g transform="rotate(28 200 352)">
        <Region id="mmrtg">
          <rect x={112} y={318} width={90} height={68} rx={8} />
          <rect x={102} y={336} width={106} height={32} rx={14} />
        </Region>
        <Detail>
          {[122, 136, 150, 164, 178, 192].map((x) => (
            <g key={x}>
              <path d={`M${x} 319 L${x} 336`} />
              <path d={`M${x} 368 L${x} 385`} />
            </g>
          ))}
        </Detail>
      </g>

      {/* High-gain antenna */}
      <Region id="hga">
        <rect x={282} y={304} width={12} height={34} rx={3} />
        <polygon points={hexagonPoints(288, 276, 32)} />
      </Region>
      <Detail>
        <polygon points={hexagonPoints(288, 276, 19)} />
        <circle cx={288} cy={276} r={4} />
      </Detail>

      {/* RAD on deck, pointed at the sky */}
      <Region id="rad">
        <rect x={392} y={310} width={30} height={28} rx={5} />
      </Region>
      <Detail>
        <ellipse cx={407} cy={312} rx={10} ry={4} />
        <path d="M398 326 L416 326" />
      </Detail>

      {/* Mast with REMS booms */}
      <TubeRegion id="mast" d="M487 338 L487 210" width={14} />
      <Detail width={3}>
        <path d="M480 290 L452 280" />
        <path d="M494 290 L522 280" />
        <circle cx={449} cy={279} r={4} />
        <circle cx={525} cy={279} r={4} />
      </Detail>

      {/* Mast head: ChemCam */}
      <Region id="chemcam">
        <rect x={432} y={158} width={110} height={50} rx={8} />
      </Region>
      <Detail>
        <circle cx={487} cy={183} r={18} />
        <circle cx={487} cy={183} r={11} />
        <circle cx={487} cy={183} r={4} />
        <path d="M444 168 L458 168" />
        <path d="M516 168 L530 168" />
      </Detail>

      {/* Mastcam: larger 100 mm eye (viewer's left), smaller 34 mm eye */}
      <Region id="mastcam">
        <rect x={436} y={212} width={42} height={30} rx={5} />
        <rect x={500} y={214} width={30} height={22} rx={4} />
      </Region>
      <Detail>
        <circle cx={457} cy={227} r={10} />
        <circle cx={457} cy={227} r={4} />
        <circle cx={515} cy={225} r={6} />
        <circle cx={515} cy={225} r={2.5} />
      </Detail>

      {/* Body and deck */}
      <Region id="deck">
        <rect x={190} y={338} width={350} height={14} rx={5} />
      </Region>
      <Region id="body">
        <path d="M204 352 L522 352 L548 392 L524 440 L214 440 L196 404 Z" />
      </Region>
      <Detail>
        <path d="M214 392 L410 392" />
        <path d="M330 352 L330 392" />
        <rect x={214} y={406} width={42} height={24} rx={4} />
        <path d="M222 418 L248 418" />
        <circle cx={536} cy={398} r={4} />
        <circle cx={532} cy={414} r={4} />
      </Detail>

      {/* SAM inside the front of the body */}
      <Region id="sam">
        <rect x={424} y={362} width={84} height={62} rx={8} strokeDasharray="7 5" />
      </Region>
      <Detail>
        <rect x={436} y={374} width={60} height={38} rx={5} />
        <circle cx={452} cy={393} r={6} />
        <circle cx={466} cy={393} r={6} />
        <circle cx={480} cy={393} r={6} />
      </Detail>

      {/* Rocker-bogie suspension */}
      <TubeRegion id="bogie" d="M365 500 L300 462 L185 500" width={12} />
      <TubeRegion id="rocker" d="M545 500 L448 420 L300 462" width={12} />
      <Detail width={3}>
        <circle cx={448} cy={420} r={7} />
        <circle cx={300} cy={462} r={7} />
      </Detail>

      <Wheel id="wheel-rear" cx={185} cy={500} r={44} variant="curiosity" />
      <Wheel id="wheel-middle" cx={365} cy={500} r={44} variant="curiosity" />
      <Wheel id="wheel-front" cx={545} cy={500} r={44} variant="curiosity" />

      {/* Robotic arm, raised forward */}
      <TubeRegion id="arm-upper" d="M534 400 L640 424" width={16} />
      <TubeRegion id="arm-lower" d="M640 424 L700 336" width={14} />
      <Detail width={3}>
        <circle cx={534} cy={400} r={10} />
        <circle cx={640} cy={424} r={11} />
      </Detail>

      {/* Turret: drill pointing forward, MAHLI on top, APXS below */}
      <Region id="drill">
        <rect x={724} y={306} width={52} height={18} rx={4} />
        <path d="M776 309 L792 315 L776 321 Z" />
      </Region>
      <Detail>
        <path d="M736 308 L744 322" />
        <path d="M750 308 L758 322" />
        <path d="M764 308 L772 322" />
      </Detail>
      <Region id="mahli">
        <rect x={690} y={268} width={32} height={24} rx={5} />
      </Region>
      <Detail>
        <circle cx={706} cy={280} r={6} />
        <circle cx={706} cy={280} r={2.5} />
      </Detail>
      <Region id="turret">
        <rect x={716} y={334} width={28} height={22} rx={5} />
        <circle cx={708} cy={316} r={26} />
      </Region>
      <Detail>
        <circle cx={708} cy={316} r={11} />
      </Detail>
    </IllustrationFrame>
  )
}
