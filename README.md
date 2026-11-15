# NASA Space Explorers

A kid-friendly, NASA-inspired coloring game built with Next.js. Players explore rover missions, choose parts of an illustration to paint, get color suggestions before painting, and test what they learned with a short quiz.

## Features

- Illustrated rover levels with real mission photos and credits
- Guided, part-first coloring with color recommendations
- Hands-on onboarding tutorial for the first level
- Quiz scores and level progress saved in the browser
- Sequential progression, with an option to skip an unlocked level
- Sound controls and level-specific mission facts

## Getting started

Install dependencies with the project package manager, then start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |

## Project structure

- `app/` — Next.js App Router pages, including the level list and gameplay route
- `components/` — Menus, level cards, coloring game, quiz, tutorial, and shared UI
- `lib/levels/` — Level content and mission data
- `lib/progress.ts` — Level unlocks, skips, quiz results, and progress state
- `lib/local-store.ts` — Client-side persistence for player progress and artwork

Progress is stored locally in the player’s browser; it is not shared between devices or accounts.
