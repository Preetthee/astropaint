import { ArrowLeft, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SpaceBackground } from '@/components/space-background'
import { LEVELS } from '@/lib/levels'

export const metadata: Metadata = {
  title: 'Sources & credits — NASA Space Explorers',
}

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-4"
    >
      {label}
      <ExternalLink className="size-3.5" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

export default function CreditsPage() {
  return (
    <>
      <SpaceBackground dense={false} />
      <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-8 px-4 py-6 md:px-6">
        <Link
          href="/"
          className="flex h-14 items-center gap-2 self-start rounded-full bg-card px-5 font-bold shadow-lg ring-2 ring-border transition hover:bg-muted"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          Menu
        </Link>
        <header className="flex flex-col gap-3">
          <h1 className="text-5xl font-bold text-balance">Sources & credits</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            NASA Space Explorers is a fan-made educational project. It is not affiliated with, sponsored or endorsed by
            NASA or JPL. All rover facts were checked against official NASA mission pages. The coloring illustrations
            are original simplified drawings traced from the NASA references below.
          </p>
        </header>

        {LEVELS.map((level) => (
          <section key={level.id} className="flex flex-col gap-4 rounded-3xl bg-card p-6 ring-2 ring-border">
            <h2 className="text-3xl font-bold">
              Level {level.order}: {level.name}
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <img
                src={level.photo.src || '/placeholder.svg'}
                alt={level.photo.alt}
                className="aspect-[16/10] w-full rounded-2xl object-cover sm:w-64"
              />
              <div className="flex flex-col gap-1 leading-relaxed">
                <p className="font-bold">Photo: {level.photo.title}</p>
                <p>Credit: {level.photo.credit}</p>
                <SourceLink label="View on NASA Image Library" url={level.photo.sourceUrl} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">Illustration references</h3>
              <ul className="flex flex-col gap-1">
                {level.illustrationReferences.map((s) => (
                  <li key={s.url}>
                    <SourceLink label={s.label} url={s.url} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">Fact sources by part</h3>
              <ul className="flex flex-col gap-2">
                {level.components.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-bold">{c.name}:</span>
                    {c.sources.map((s) => (
                      <SourceLink key={s.url + s.label} label={s.label} url={s.url} />
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <section className="flex flex-col gap-2 rounded-3xl bg-card p-6 leading-relaxed ring-2 ring-border">
          <h2 className="text-2xl font-bold">Sound & voice</h2>
          <p>
            Rover voices use your browser&apos;s built-in text-to-speech. Music and sound effects are generated live in the
            browser with the Web Audio API — no recorded audio is used. NASA images are used under{' '}
            <SourceLink label="NASA's media usage guidelines" url="https://www.nasa.gov/nasa-brand-center/images-and-media/" />
            .
          </p>
        </section>
      </main>
    </>
  )
}
