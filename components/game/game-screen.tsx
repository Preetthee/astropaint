'use client'

import {
  Download,
  Eraser,
  HelpCircle,
  Home,
  Lock,
  Paintbrush,
  PartyPopper,
  Redo2,
  Search,
  Trash2,
  Undo2,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ILLUSTRATIONS } from '@/components/illustrations'
import { Modal } from '@/components/modal'
import { RoverAvatar } from '@/components/rover-avatar'
import { SoundSettingsButton } from '@/components/sound-settings'
import { sfx, speak, stopVoice } from '@/lib/audio'
import { celebrate } from '@/lib/celebrate'
import { downloadSvgAsPng, PALETTE, useColoringHistory } from '@/lib/coloring'
import { getLevel, LEVELS, type LevelData } from '@/lib/levels'
import { useHydrated } from '@/lib/local-store'
import {
  getLevelProgress,
  isLevelUnlocked,
  markDiscovered,
  progressStore,
  saveArtwork,
  updateLevel,
  useProgress,
  type Fills,
} from '@/lib/progress'
import { cn } from '@/lib/utils'
import { CharacterDialog } from './character-dialog'
import { ColorPalette } from './color-palette'
import { CompletionScreen } from './completion-screen'
import { PartsList } from './parts-list'
import { ProgressBar } from './progress-bar'
import { Quiz } from './quiz'

type Tool = 'brush' | 'eraser' | 'explore'
type Phase = 'intro' | 'coloring' | 'complete' | 'quiz'

function ToolButton({
  label,
  icon: Icon,
  onClick,
  pressed,
  disabled,
}: {
  label: string
  icon: typeof Paintbrush
  onClick: () => void
  pressed?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={cn(
        'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-xs font-bold transition disabled:opacity-35',
        pressed ? 'bg-accent text-accent-foreground' : 'bg-muted text-foreground hover:bg-border',
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
      {label}
    </button>
  )
}

function LevelPlay({ level, savedFills }: { level: LevelData; savedFills: Fills }) {
  const Art = ILLUSTRATIONS[level.id]
  const svgRef = useRef<SVGSVGElement>(null)
  const history = useColoringHistory(savedFills)
  const { fills } = history
  const progress = useProgress()
  const lp = getLevelProgress(progress, level.id)

  const [phase, setPhase] = useState<Phase>('intro')
  const [tool, setTool] = useState<Tool>('brush')
  const [color, setColor] = useState(PALETTE[0].hex)
  const [selected, setSelected] = useState<string | null>(null)
  const [dialog, setDialog] = useState({ heading: `Hi! I'm ${level.name}`, line: level.intro })
  const [confirmReset, setConfirmReset] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  const regionToComponent = useMemo(
    () => Object.fromEntries(level.regions.map((r) => [r.id, r.componentId])),
    [level],
  )
  const labels = useMemo(
    () => Object.fromEntries(level.regions.map((r) => [r.id, r.label])),
    [level],
  )
  const highlighted = useMemo(
    () => new Set(level.regions.filter((r) => r.componentId === selected).map((r) => r.id)),
    [level, selected],
  )

  const coloredCount = level.regions.filter((r) => fills[r.id]).length
  const total = level.regions.length
  const allColored = coloredCount === total

  // Persist artwork to localStorage whenever the fills change.
  useEffect(() => {
    saveArtwork(level.id, fills)
  }, [level.id, fills])

  useEffect(() => () => stopVoice(), [])

  const say = (heading: string, line: LevelData['intro']) => {
    setDialog({ heading, line })
    speak(line, level.voice)
  }

  const explain = (componentId: string, force = false) => {
    const comp = level.components.find((c) => c.id === componentId)
    if (!comp) return
    markDiscovered(level.id, componentId)
    setSelected(componentId)
    if (force || componentId !== selected) say(comp.name, comp.line)
  }

  const handleRegion = (regionId: string) => {
    const componentId = regionToComponent[regionId]
    if (tool === 'explore') {
      sfx.click()
      explain(componentId, true)
      return
    }
    const wasComplete = allColored
    const nextColor = tool === 'eraser' ? null : color
    if (tool === 'eraser') sfx.erase()
    else sfx.paint()
    history.paint(regionId, nextColor)

    const willBeComplete =
      tool === 'brush' && level.regions.every((r) => r.id === regionId || fills[r.id])
    if (!wasComplete && willBeComplete) {
      markDiscovered(level.id, componentId)
      setSelected(componentId)
      updateLevel(level.id, { colored: true })
      sfx.fanfare()
      celebrate()
      say('You colored every part!', level.allColored)
      return
    }
    explain(componentId)
  }

  const finish = () => {
    sfx.whoosh()
    setSelected(null)
    setPhase('complete')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    celebrate()
    speak(level.completion, level.voice)
  }

  if (phase === 'complete' || phase === 'quiz') {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-4 md:px-6">
        <GameHeader level={level} onHelp={() => setHelpOpen(true)} />
        {phase === 'complete' ? (
          <CompletionScreen
            level={level}
            fills={fills}
            onBack={() => {
              stopVoice()
              setPhase('coloring')
            }}
            onStartQuiz={() => {
              sfx.click()
              setPhase('quiz')
              speak({ text: `Quiz time! ${level.quiz[0].question}` }, level.voice)
            }}
          />
        ) : (
          <div className="mx-auto w-full max-w-3xl rounded-[2rem] bg-card p-5 ring-4 ring-border md:p-8">
            <Quiz
              level={level}
              onReplayLevel={() => {
                stopVoice()
                setPhase('coloring')
              }}
            />
          </div>
        )}
        <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1400px] flex-col gap-3 px-3 py-3 md:px-5 lg:h-dvh lg:min-h-0">
      <GameHeader level={level} onHelp={() => setHelpOpen(true)}>
        <ProgressBar value={coloredCount} total={total} label="Parts colored" />
        <div className="hidden sm:flex sm:min-w-40 sm:flex-col">
          <ProgressBar value={lp.discovered.length} total={level.components.length} label="Discovered" />
        </div>
      </GameHeader>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[13rem_minmax(0,1fr)_22rem]">
        {/* Tools + palette */}
        <aside className="order-3 flex flex-col gap-3 rounded-3xl bg-card p-3 ring-2 ring-border lg:order-1 lg:overflow-y-auto">
          <div className="grid grid-cols-7 gap-1.5 lg:grid-cols-3">
            <ToolButton label="Brush" icon={Paintbrush} pressed={tool === 'brush'} onClick={() => { sfx.click(); setTool('brush') }} />
            <ToolButton label="Eraser" icon={Eraser} pressed={tool === 'eraser'} onClick={() => { sfx.click(); setTool('eraser') }} />
            <ToolButton label="Explore" icon={Search} pressed={tool === 'explore'} onClick={() => { sfx.click(); setTool('explore') }} />
            <ToolButton label="Undo" icon={Undo2} disabled={!history.canUndo} onClick={() => { sfx.click(); history.undo() }} />
            <ToolButton label="Redo" icon={Redo2} disabled={!history.canRedo} onClick={() => { sfx.click(); history.redo() }} />
            <ToolButton label="Reset" icon={Trash2} disabled={coloredCount === 0} onClick={() => { sfx.click(); setConfirmReset(true) }} />
            <ToolButton
              label="Save"
              icon={Download}
              onClick={() => {
                sfx.click()
                if (svgRef.current)
                  void downloadSvgAsPng(svgRef.current, `${level.id}-coloring.png`, `My ${level.name} — NASA Space Explorers`)
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-muted-foreground">
              {tool === 'eraser' ? 'Eraser: tap a part to clear it' : tool === 'explore' ? 'Explore: tap a part to learn' : 'Pick a color'}
            </p>
            <ColorPalette
              color={color}
              active={tool === 'brush'}
              onChange={(hex) => {
                setColor(hex)
                setTool('brush')
                sfx.click()
              }}
            />
          </div>
        </aside>

        {/* Canvas */}
        <section
          aria-label={`${level.name} coloring page`}
          className="order-2 flex min-h-0 items-center justify-center rounded-[2rem] bg-paper p-2 ring-4 ring-border lg:order-2"
        >
          <Art
            fills={fills}
            interactive
            labels={labels}
            highlighted={highlighted}
            onRegion={handleRegion}
            svgRef={svgRef}
            className="h-auto max-h-full w-full lg:h-full"
          />
        </section>

        {/* Character + parts */}
        <aside className="order-1 flex min-h-0 flex-col gap-3 lg:order-3 lg:overflow-y-auto">
          <CharacterDialog
            level={level}
            heading={dialog.heading}
            text={dialog.line.text}
            onReplay={() => speak(dialog.line, level.voice)}
          />
          <div className="hidden rounded-3xl bg-card p-4 ring-2 ring-border lg:block">
            <PartsList
              level={level}
              discovered={lp.discovered}
              selected={selected}
              onSelect={(id) => {
                sfx.click()
                explain(id, true)
              }}
            />
          </div>
          <button
            type="button"
            onClick={finish}
            disabled={!allColored}
            className={cn(
              'hidden h-16 items-center justify-center gap-2 rounded-full text-xl font-bold transition lg:flex',
              allColored
                ? 'animate-pop bg-primary text-primary-foreground shadow-[0_6px_0_0_#a8441a] hover:-translate-y-0.5'
                : 'bg-muted text-muted-foreground',
            )}
          >
            <PartyPopper className="size-6" aria-hidden="true" />
            {allColored ? 'Finish mission!' : `Color ${total - coloredCount} more parts`}
          </button>
        </aside>
      </div>

      {/* Mobile/tablet: parts + finish below */}
      <div className="flex flex-col gap-3 pb-4 lg:hidden">
        <button
          type="button"
          onClick={finish}
          disabled={!allColored}
          className={cn(
            'flex h-16 items-center justify-center gap-2 rounded-full text-xl font-bold transition',
            allColored ? 'animate-pop bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
          )}
        >
          <PartyPopper className="size-6" aria-hidden="true" />
          {allColored ? 'Finish mission!' : `Color ${total - coloredCount} more parts`}
        </button>
        <div className="rounded-3xl bg-card p-4 ring-2 ring-border">
          <PartsList
            level={level}
            discovered={lp.discovered}
            selected={selected}
            onSelect={(id) => {
              sfx.click()
              explain(id, true)
            }}
          />
        </div>
      </div>

      {phase === 'intro' && (
        <Modal
          open
          onClose={() => setPhase('coloring')}
          title={`Level ${level.order}: ${level.title}`}
        >
          <div className="flex items-start gap-4">
            <RoverAvatar accent={level.accent} className="size-20" />
            <p className="text-lg leading-relaxed font-semibold">{level.intro.text}</p>
          </div>
          <ul className="flex flex-col gap-2 rounded-2xl bg-muted p-4 leading-relaxed">
            <li>
              <strong>Tap a part</strong> to color it and hear what it does.
            </li>
            <li>
              <strong>Color every part</strong> to finish the mission and take a quiz.
            </li>
          </ul>
          <button
            type="button"
            onClick={() => {
              setPhase('coloring')
              sfx.whoosh()
              say(`Hi! I'm ${level.name}`, level.intro)
            }}
            className="flex h-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground transition hover:-translate-y-0.5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {coloredCount > 0 ? 'Continue coloring' : "Let's go!"}
          </button>
        </Modal>
      )}

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Clear all colors?">
        <p className="text-lg leading-relaxed">
          This will make the picture black and white again. You can tap Undo to bring the colors back.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              history.reset()
              sfx.erase()
              setSelected(null)
              setConfirmReset(false)
            }}
            className="h-14 flex-1 rounded-full bg-primary text-lg font-bold text-primary-foreground"
          >
            Yes, clear it
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(false)}
            className="h-14 flex-1 rounded-full bg-muted text-lg font-bold"
          >
            Keep my colors
          </button>
        </div>
      </Modal>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </main>
  )
}

function GameHeader({
  level,
  onHelp,
  children,
}: {
  level: LevelData
  onHelp: () => void
  children?: React.ReactNode
}) {
  return (
    <header className="flex items-center gap-3">
      <Link
        href="/levels"
        onClick={() => sfx.click()}
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-card shadow-lg ring-2 ring-border transition hover:bg-muted"
      >
        <Home className="size-6" aria-hidden="true" />
        <span className="sr-only">Back to levels</span>
      </Link>
      <div className="hidden min-w-0 flex-col md:flex">
        <p className="text-xs font-bold tracking-wide text-accent uppercase">Level {level.order}</p>
        <h1 className="truncate text-2xl leading-tight font-bold">{level.title}</h1>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-4 md:justify-end md:pl-4">{children}</div>
      <button
        type="button"
        onClick={() => {
          sfx.click()
          onHelp()
        }}
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-card shadow-lg ring-2 ring-border transition hover:bg-muted"
      >
        <HelpCircle className="size-6" aria-hidden="true" />
        <span className="sr-only">How to play</span>
      </button>
      <SoundSettingsButton className="shrink-0" />
    </header>
  )
}

function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = [
    { icon: Paintbrush, title: 'Brush', text: 'Pick a color, then tap any part of the rover to paint it.' },
    { icon: Eraser, title: 'Eraser', text: 'Tap a part to make it white again.' },
    { icon: Search, title: 'Explore', text: 'Tap a part to hear about it without coloring.' },
    { icon: Undo2, title: 'Undo and Redo', text: 'Go back or forward one step.' },
    { icon: Trash2, title: 'Reset', text: 'Clear every color and start fresh.' },
    { icon: Download, title: 'Save', text: 'Download your picture to keep or print.' },
  ]
  return (
    <Modal open={open} onClose={onClose} title="How to play">
      <ul className="flex flex-col gap-3">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3 rounded-2xl bg-muted p-3">
            <Icon className="mt-0.5 size-6 shrink-0 text-accent" aria-hidden="true" />
            <span className="leading-relaxed">
              <strong>{title}:</strong> {text}
            </span>
          </li>
        ))}
      </ul>
      <p className="leading-relaxed text-muted-foreground">
        Color every part to finish the mission. Then answer the quiz to unlock the next rover. Your coloring is saved
        on this device automatically.
      </p>
    </Modal>
  )
}

export function GameScreen({ levelId }: { levelId: string }) {
  const hydrated = useHydrated()
  const progress = useProgress()
  const level = getLevel(levelId)

  if (!level) return null
  if (!hydrated) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="animate-pulse text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Launching {level.name}…
        </p>
      </main>
    )
  }

  if (!isLevelUnlocked(progress, level.id)) {
    const prev = LEVELS.find((l) => l.order === level.order - 1)
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-card ring-4 ring-border">
          <Lock className="size-12 text-accent" aria-hidden="true" />
        </span>
        <h1 className="text-4xl font-bold text-balance">{level.name} is still locked</h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          Finish Level {prev?.order} and pass its quiz to unlock this rover.
        </p>
        {prev && (
          <Link
            href={`/levels/${prev.id}`}
            className="flex h-16 items-center rounded-full bg-primary px-8 text-xl font-bold text-primary-foreground"
          >
            Play Level {prev.order}: {prev.name}
          </Link>
        )}
      </main>
    )
  }

  return <LevelPlay key={level.id} level={level} savedFills={progressStore.get().artwork[level.id] ?? {}} />
}
