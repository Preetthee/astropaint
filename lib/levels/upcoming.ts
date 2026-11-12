import type { Photo } from './types'

/** Preview-only levels shown as "coming soon". They are not playable yet. */
export interface UpcomingLevel {
  id: string
  order: number
  name: string
  destination: 'Mars' | 'Moon'
  teaser: string
  facts: { label: string; value: string }[]
  photo: Photo
}

export const UPCOMING_LEVELS: UpcomingLevel[] = [
  {
    id: 'ingenuity',
    order: 3,
    name: 'Ingenuity',
    destination: 'Mars',
    teaser: 'The little helicopter that made the first powered, controlled flight on another planet.',
    facts: [
      { label: 'Type', value: 'Helicopter' },
      { label: 'First flight', value: 'April 2021' },
      { label: 'Flights', value: '72' },
    ],
    photo: {
      src: '/images/upcoming/ingenuity.jpg',
      alt: 'The flight model of NASA’s Ingenuity Mars Helicopter',
      credit: 'NASA/JPL-Caltech',
      sourceUrl: 'https://images.nasa.gov/details/PIA23882',
    },
  },
  {
    id: 'opportunity',
    order: 4,
    name: 'Opportunity',
    destination: 'Mars',
    teaser: 'Planned for 90 days, this solar-powered rover kept exploring Mars for almost 15 years.',
    facts: [
      { label: 'Landed', value: '2004' },
      { label: 'Power', value: 'Solar' },
      { label: 'Drove', value: '45 km' },
    ],
    photo: {
      src: '/images/upcoming/opportunity.jpg',
      alt: 'Artist concept of a NASA Mars Exploration Rover on Mars',
      credit: 'NASA/JPL/Cornell University (artist concept)',
      sourceUrl: 'https://images.nasa.gov/details/PIA04413',
    },
  },
  {
    id: 'sojourner',
    order: 5,
    name: 'Sojourner',
    destination: 'Mars',
    teaser: 'The very first rover on Mars, about the size of a microwave oven.',
    facts: [
      { label: 'Landed', value: '1997' },
      { label: 'Mission', value: 'Pathfinder' },
      { label: 'Wheels', value: '6' },
    ],
    photo: {
      src: '/images/upcoming/sojourner.jpg',
      alt: 'The Sojourner rover beside a rock on Mars',
      credit: 'NASA/JPL',
      sourceUrl: 'https://images.nasa.gov/details/PIA01122',
    },
  },
  {
    id: 'lunar-rover',
    order: 6,
    name: 'Lunar Roving Vehicle',
    destination: 'Moon',
    teaser: 'The electric car Apollo astronauts drove across the Moon.',
    facts: [
      { label: 'First drive', value: '1971' },
      { label: 'Missions', value: 'Apollo 15–17' },
      { label: 'Drivers', value: 'Astronauts' },
    ],
    photo: {
      src: '/images/upcoming/lunar-rover.jpg',
      alt: 'Astronaut James Irwin working at the Lunar Roving Vehicle on Apollo 15',
      credit: 'NASA',
      sourceUrl: 'https://images.nasa.gov/details/as15-86-11603',
    },
  },
]
