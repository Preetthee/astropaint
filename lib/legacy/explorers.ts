import type { Photo, VoiceProfile } from '@/lib/levels/types'

export type Destination = 'moon' | 'mars' | 'deep'

/**
 * silent       – no longer in contact with Earth
 * still-working – passive hardware still used by scientists today
 * still-talking – still sending data home
 */
export type ExplorerStatus = 'silent' | 'still-working' | 'still-talking'

export interface StoryChapter {
  title: string
  text: string
  photo?: Photo
}

export interface MemoryQuestion {
  prompt: string
  options: string[]
  answerIndex: number
  explain: string
}

export interface Explorer {
  id: string
  name: string
  kind: string
  destination: Destination
  status: ExplorerStatus
  site: string
  /** Planetocentric latitude / east longitude, used to place the map pin. */
  lat?: number
  lon?: number
  /** For deep-space explorers: where they are now, in plain words. */
  whereNow?: string
  log: { label: string; value: string }[]
  tagline: string
  photo: Photo
  voice: VoiceProfile
  chapters: StoryChapter[]
  question: MemoryQuestion
  related?: { href: string; label: string }
}

export const DESTINATIONS: { id: Destination; name: string; blurb: string }[] = [
  {
    id: 'moon',
    name: 'The Moon',
    blurb: 'Landers, laser mirrors and moon cars left behind by robots and astronauts.',
  },
  {
    id: 'mars',
    name: 'Mars',
    blurb: 'Landers, rovers and a helicopter resting quietly on the red planet.',
  },
  {
    id: 'deep',
    name: 'Deep space',
    blurb: 'Four probes flying away from the Sun, forever.',
  },
]

export const STATUS_LABEL: Record<ExplorerStatus, string> = {
  silent: 'Silent now',
  'still-working': 'Still helping science',
  'still-talking': 'Still talking to Earth',
}

const ROBOT_VOICE: VoiceProfile = { pitch: 1.15, rate: 0.95 }
const GENTLE_VOICE: VoiceProfile = { pitch: 1.0, rate: 0.92 }
const BRIGHT_VOICE: VoiceProfile = { pitch: 1.3, rate: 1.0 }
const DEEP_VOICE: VoiceProfile = { pitch: 0.85, rate: 0.9 }

export const EXPLORERS: Explorer[] = [
  /* ============================== MOON ============================== */
  {
    id: 'surveyor-3',
    name: 'Surveyor 3',
    kind: 'Robot lander',
    destination: 'moon',
    status: 'silent',
    site: 'Ocean of Storms',
    lat: -3.01,
    lon: -23.42,
    tagline: 'The only robot on another world that astronauts walked over to visit.',
    log: [
      { label: 'Landed', value: 'April 20, 1967' },
      { label: 'Pictures sent', value: 'More than 6,000' },
      { label: 'Visited by', value: 'Apollo 12, Nov 1969' },
    ],
    photo: {
      src: '/images/legacy/surveyor3.jpg',
      alt: 'Astronaut Alan Bean standing beside the Surveyor 3 lander on the Moon, with the Apollo 12 lunar module in the background',
      credit: 'NASA (AS12-48-7134)',
      sourceUrl: 'https://images.nasa.gov/details/AS12-48-7134',
    },
    voice: ROBOT_VOICE,
    chapters: [
      {
        title: 'Hello from the Ocean of Storms',
        text: "Hi! I'm Surveyor 3, a robot lander. I touched down on the Moon in April 1967 — more than two years before any human walked there.",
      },
      {
        title: 'Is the ground safe?',
        text: 'Before astronauts could land, NASA had to know: is the Moon’s ground solid, or is it deep, fluffy dust? I used a little scoop to dig trenches and poke the soil. Good news — it was firm enough to land on!',
      },
      {
        title: 'Snap, snap, snap',
        text: 'My TV camera sent more than 6,000 pictures back to Earth. Engineers used them to plan where astronauts could land safely.',
      },
      {
        title: 'Surprise visitors',
        text: 'In November 1969, Apollo 12 landed close to me. Astronauts Pete Conrad and Alan Bean walked over to say hello! They took my camera and some of my parts home, so scientists could study what years on the Moon do to metal and glass.',
      },
      {
        title: 'Still standing',
        text: 'I am still sitting in my crater today. I am the only robot on another world that humans have ever visited. Maybe one day, you will come and see me too.',
      },
    ],
    question: {
      prompt: 'Who came to visit Surveyor 3 on the Moon?',
      options: ['Apollo 12 astronauts', 'A Mars rover', 'Nobody, ever'],
      answerIndex: 0,
      explain: 'Pete Conrad and Alan Bean of Apollo 12 walked to Surveyor 3 in 1969 and brought its camera home.',
    },
  },
  {
    id: 'apollo-11-reflector',
    name: 'Apollo 11 Laser Reflector',
    kind: 'Science instrument',
    destination: 'moon',
    status: 'still-working',
    site: 'Tranquility Base',
    lat: 0.67,
    lon: 23.47,
    tagline: 'A panel of 100 mirrors that scientists still shine lasers at today.',
    log: [
      { label: 'Placed', value: 'July 1969' },
      { label: 'Mirrors', value: '100' },
      { label: 'Power needed', value: 'None!' },
    ],
    photo: {
      src: '/images/legacy/apollo11.jpg',
      alt: 'Buzz Aldrin on the Moon beside the Apollo 11 science experiments, including the laser reflector panel',
      credit: 'NASA (AS11-40-5948)',
      sourceUrl: 'https://images.nasa.gov/details/as11-40-5948',
    },
    voice: GENTLE_VOICE,
    chapters: [
      {
        title: 'Set down by famous hands',
        text: "Hi! I'm a laser reflector — a flat panel holding 100 special mirrors. Apollo 11 astronauts set me down on the Moon in July 1969, during humanity’s very first moonwalk.",
      },
      {
        title: 'Catch the light',
        text: 'Here is my job. Scientists on Earth fire a powerful laser beam at me. My mirrors bounce the light straight back to where it came from. By timing how long the round trip takes, they can measure the distance to the Moon very precisely.',
      },
      {
        title: 'The drifting Moon',
        text: 'Thanks to me and my reflector friends from later missions, we discovered something amazing: the Moon is slowly drifting away from Earth — about 3.8 centimeters every year. That’s about as fast as your fingernails grow!',
      },
      {
        title: 'Nearby: a launchpad left behind',
        text: 'Next to me sits the bottom half of the lunar module, Eagle. When the astronauts left, the top half blasted off and used the bottom half as its launchpad. It is still here, with my other neighbors: footprints and a flag.',
      },
      {
        title: 'Still on the job',
        text: 'I don’t need batteries, sunlight or power of any kind. So more than 50 years later, I am still working. Every laser beam that comes back is a little hello from the Moon.',
      },
    ],
    question: {
      prompt: 'How do scientists use the laser reflector?',
      options: ['To bounce lasers and measure the Moon’s distance', 'To charge batteries', 'To talk to astronauts'],
      answerIndex: 0,
      explain: 'Timing a laser’s round trip to the mirrors shows the Moon is drifting away by about 3.8 cm every year.',
    },
  },
  {
    id: 'apollo-15-rover',
    name: 'Apollo 15 Moon Buggy',
    kind: 'Lunar Roving Vehicle',
    destination: 'moon',
    status: 'silent',
    site: 'Hadley–Apennine',
    lat: 26.13,
    lon: 3.63,
    tagline: 'The first car ever driven on another world.',
    log: [
      { label: 'First drive', value: 'July 31, 1971' },
      { label: 'Driven', value: 'About 28 km' },
      { label: 'Power', value: 'Batteries' },
    ],
    photo: {
      src: '/images/upcoming/lunar-rover.jpg',
      alt: 'Astronaut James Irwin working at the Lunar Roving Vehicle on Apollo 15',
      credit: 'NASA (AS15-86-11603)',
      sourceUrl: 'https://images.nasa.gov/details/as15-86-11603',
    },
    voice: BRIGHT_VOICE,
    chapters: [
      {
        title: 'Vroom on the Moon',
        text: "Hi! I'm the Lunar Roving Vehicle from Apollo 15. On July 31, 1971, I became the first car ever driven on another world!",
      },
      {
        title: 'Folded like a beach chair',
        text: 'I flew to the Moon folded up flat on the side of the lunar module. The astronauts pulled on straps, and I unfolded — wheels, seats and all.',
      },
      {
        title: 'No rubber tires',
        text: 'Rubber tires would not work well in the Moon’s extreme heat and cold, so my wheels were made of woven steel wire mesh. I ran on batteries, like an electric car. Astronauts Dave Scott and Jim Irwin drove me about 28 kilometers.',
      },
      {
        title: 'The Genesis Rock',
        text: 'Because I could carry them farther, the astronauts explored the slopes of the Moon’s mountains. There they found a bright white rock nicknamed the Genesis Rock, a piece of the Moon’s very old crust.',
      },
      {
        title: 'Parked for good',
        text: 'When the mission ended, I stayed behind. Two brother rovers from Apollo 16 and Apollo 17 are parked on the Moon too. We are waiting for new drivers.',
      },
    ],
    question: {
      prompt: 'What were the Moon buggy’s wheels made of?',
      options: ['Woven steel wire mesh', 'Rubber', 'Wood'],
      answerIndex: 0,
      explain: 'Wire-mesh wheels handled the Moon’s extreme temperatures better than rubber tires would.',
    },
    related: { href: '/levels/curiosity', label: 'Color Curiosity, a rover on wheels too' },
  },
  {
    id: 'apollo-17-rover',
    name: 'Apollo 17 Moon Buggy',
    kind: 'Lunar Roving Vehicle',
    destination: 'moon',
    status: 'silent',
    site: 'Taurus–Littrow valley',
    lat: 20.19,
    lon: 30.77,
    tagline: 'The last car driven by humans on the Moon — fixed with duct tape!',
    log: [
      { label: 'Mission', value: 'December 1972' },
      { label: 'Driven', value: 'About 36 km' },
      { label: 'Famous fix', value: 'Duct tape' },
    ],
    photo: {
      src: '/images/legacy/apollo17-lrv.jpg',
      alt: 'Astronaut Eugene Cernan driving the Lunar Roving Vehicle on the Moon during Apollo 17',
      credit: 'NASA (AS17-147-22526)',
      sourceUrl: 'https://images.nasa.gov/details/as17-147-22526',
    },
    voice: BRIGHT_VOICE,
    chapters: [
      {
        title: 'The last Apollo',
        text: "Hi! I'm the Moon buggy from Apollo 17. In December 1972, I carried the last astronauts to walk on the Moon: Gene Cernan and Harrison Schmitt.",
      },
      {
        title: 'Oops, my fender!',
        text: 'Gene accidentally knocked off part of my fender. Without it, my wheels sprayed sticky Moon dust all over everything! The astronauts made a new fender out of maps, tape and clamps. It worked!',
      },
      {
        title: 'Orange soil',
        text: 'Harrison Schmitt was a geologist — a rock scientist. Near a crater, he spotted orange soil. It turned out to be tiny beads of glass from ancient volcanic eruptions on the Moon.',
      },
      {
        title: 'My longest trips',
        text: 'I drove about 36 kilometers — the farthest of all three Moon buggies. The astronauts brought back more Moon rocks than any other Apollo mission.',
      },
      {
        title: 'Waiting for you',
        text: 'Since 1972, nobody has driven me. NASA’s Artemis program plans to send astronauts back to the Moon. I wonder who will drive across the Moon next.',
      },
    ],
    question: {
      prompt: 'What did the orange soil found on Apollo 17 come from?',
      options: ['Ancient volcanic eruptions', 'Rust from the buggy', 'Mars dust'],
      answerIndex: 0,
      explain: 'The orange soil is made of tiny glass beads sprayed out by ancient lunar volcanoes.',
    },
  },

  /* ============================== MARS ============================== */
  {
    id: 'viking-1',
    name: 'Viking 1 Lander',
    kind: 'Robot lander',
    destination: 'mars',
    status: 'silent',
    site: 'Chryse Planitia',
    lat: 22.27,
    lon: -47.95,
    tagline: 'NASA’s first lander on Mars, and the first to search the soil for life.',
    log: [
      { label: 'Landed', value: 'July 20, 1976' },
      { label: 'Planned for', value: '90 days' },
      { label: 'Last contact', value: 'November 1982' },
    ],
    photo: {
      src: '/images/legacy/viking1.jpg',
      alt: 'The first color image taken on the surface of Mars by Viking Lander 1, showing orange rocky ground under a pale sky',
      credit: 'NASA/JPL (PIA00563)',
      sourceUrl: 'https://images.nasa.gov/details/PIA00563',
    },
    voice: DEEP_VOICE,
    chapters: [
      {
        title: 'First on Mars',
        text: "Hello. I'm Viking 1 Lander. On July 20, 1976 — exactly seven years after the first Moon landing — I became NASA’s first spacecraft to land on Mars.",
      },
      {
        title: 'My first picture',
        text: 'Within minutes of landing, I took a picture of the ground beside my foot. It was one of the first clear pictures ever taken on the surface of Mars. Then I showed the world Mars in color: orange rocks under a pale, dusty sky.',
      },
      {
        title: 'Is anyone home?',
        text: 'My robotic arm scooped up soil and dropped it into tiny laboratories inside my body. They tested for signs of living things. The results were puzzling, and scientists still discuss them. They taught us how to search for life much better.',
      },
      {
        title: 'Weather reporter',
        text: 'I was also a weather station. Every day I measured the temperature, the wind and the air pressure on Mars.',
      },
      {
        title: 'Six years of work',
        text: 'I was planned to work for 90 days. I kept going for more than six years, until November 1982. I am still standing on the plains of Chryse, looking at the same rocks.',
      },
    ],
    question: {
      prompt: 'What did Viking 1’s little labs test Mars soil for?',
      options: ['Signs of life', 'Gold', 'Chocolate'],
      answerIndex: 0,
      explain: 'Viking’s biology experiments were the first search for life on another planet.',
    },
  },
  {
    id: 'viking-2',
    name: 'Viking 2 Lander',
    kind: 'Robot lander',
    destination: 'mars',
    status: 'silent',
    site: 'Utopia Planitia',
    lat: 47.64,
    lon: 134.29,
    tagline: 'Viking 1’s twin, which spotted frost on Mars.',
    log: [
      { label: 'Landed', value: 'Sept 3, 1976' },
      { label: 'Discovery', value: 'Winter frost' },
      { label: 'Last contact', value: 'April 1980' },
    ],
    photo: {
      src: '/images/legacy/viking2.jpg',
      alt: 'An orbital view of the Utopia Planitia plains on Mars, with the Viking 2 landing site marked',
      credit: 'NASA/JPL/Arizona State University (PIA04023)',
      sourceUrl: 'https://images.nasa.gov/details/PIA04023',
    },
    voice: DEEP_VOICE,
    chapters: [
      {
        title: 'A twin lands far away',
        text: "Hi. I'm Viking 2 Lander, Viking 1’s twin. I landed on September 3, 1976, on a wide, rocky plain called Utopia Planitia, much farther north.",
      },
      {
        title: 'Two places, one answer',
        text: 'I carried the same tools as my twin. Because we were far apart, scientists could compare two different places on Mars.',
      },
      {
        title: 'Frost on the ground',
        text: 'When winter came, I saw something beautiful: a thin layer of white frost covering the ground around me. It showed that water was still part of Mars’s weather.',
      },
      {
        title: 'My batteries tired out',
        text: 'I worked until April 1980, when my batteries gave out. In this picture, taken from orbit years later, the X marks where I am still sitting.',
      },
    ],
    question: {
      prompt: 'What did Viking 2 photograph in the Martian winter?',
      options: ['White frost', 'A rainbow', 'Liquid lakes'],
      answerIndex: 0,
      explain: 'Viking 2 saw thin frost form on the ground around it during Martian winter.',
    },
  },
  {
    id: 'sojourner',
    name: 'Sojourner',
    kind: 'Rover',
    destination: 'mars',
    status: 'silent',
    site: 'Ares Vallis',
    lat: 19.13,
    lon: -33.22,
    tagline: 'The very first rover to drive on another planet.',
    log: [
      { label: 'Landed', value: 'July 4, 1997' },
      { label: 'Size', value: 'Microwave oven' },
      { label: 'Last contact', value: 'Sept 27, 1997' },
    ],
    photo: {
      src: '/images/upcoming/sojourner.jpg',
      alt: 'The small Sojourner rover beside a rock on Mars',
      credit: 'NASA/JPL (PIA01122)',
      sourceUrl: 'https://images.nasa.gov/details/PIA01122',
    },
    voice: BRIGHT_VOICE,
    chapters: [
      {
        title: 'Small but first',
        text: "Hi! I'm Sojourner! I'm only about the size of a microwave oven, but I was the very first rover ever to drive on another planet.",
      },
      {
        title: 'Boing, boing, boing!',
        text: 'My lander, Mars Pathfinder, arrived on July 4, 1997, wrapped in giant airbags. We bounced across the ground many times before rolling to a stop. Then I drove down a little ramp onto Mars!',
      },
      {
        title: 'Rocks with nicknames',
        text: 'Scientists gave the rocks around me fun names, like Barnacle Bill and Yogi. I drove up to them and used a special instrument to find out what they were made of.',
      },
      {
        title: 'My last message',
        text: 'I was planned to explore for just one week. I kept going for almost three months! I could only talk to Earth through my lander, so when the lander’s last message came on September 27, 1997, my story went quiet too.',
      },
      {
        title: 'The first of a family',
        text: 'I proved small wheeled robots could explore Mars. Spirit, Opportunity, Curiosity and Perseverance all followed my tracks.',
      },
    ],
    question: {
      prompt: 'How did Mars Pathfinder and Sojourner land on Mars?',
      options: ['Bouncing in giant airbags', 'On a parachute only', 'Driven by astronauts'],
      answerIndex: 0,
      explain: 'Pathfinder was cushioned by airbags and bounced across Mars before stopping.',
    },
    related: { href: '/levels/perseverance', label: 'Color Perseverance, Sojourner\'s great-grandchild' },
  },
  {
    id: 'spirit',
    name: 'Spirit',
    kind: 'Rover',
    destination: 'mars',
    status: 'silent',
    site: 'Gusev Crater',
    lat: -14.57,
    lon: 175.47,
    tagline: 'The rover whose broken wheel uncovered a big clue.',
    log: [
      { label: 'Landed', value: 'Jan 4, 2004' },
      { label: 'Drove', value: 'About 7.7 km' },
      { label: 'Last contact', value: 'March 22, 2010' },
    ],
    photo: {
      src: '/images/legacy/spirit.jpg',
      alt: 'A circular self-portrait of the Spirit rover in the middle of a 360-degree Mars panorama',
      credit: 'NASA/JPL-Caltech/Cornell Univ./Arizona State Univ. (PIA16442)',
      sourceUrl: 'https://images.nasa.gov/details/PIA16442',
    },
    voice: ROBOT_VOICE,
    chapters: [
      {
        title: 'One of the twins',
        text: "Hi! I'm Spirit. My twin is Opportunity. In January 2004, I bounced onto Mars inside airbags and landed in Gusev Crater.",
      },
      {
        title: 'Three months? Try six years!',
        text: 'I was planned to explore for about three months. Instead, I kept rolling for more than six years and climbed real Martian hills.',
      },
      {
        title: 'A lucky broken wheel',
        text: 'One of my six wheels stopped working, so I drove backwards, dragging it. That wheel scraped up bright white soil made of silica. On Earth, soil like that forms around hot springs. Places like that can be full of tiny living things!',
      },
      {
        title: 'Stuck in the sand',
        text: 'In 2009, I got stuck in soft sand at a place called Troy. I couldn’t tilt my solar panels toward the winter Sun. My last message came on March 22, 2010.',
      },
      {
        title: 'Still in Gusev',
        text: 'I am still there today. In this picture I made a self-portrait in the middle of a full circle of Mars.',
      },
    ],
    question: {
      prompt: 'What did Spirit’s broken wheel scrape up?',
      options: ['White silica soil, a sign of old hot springs', 'Diamonds', 'Ice cream'],
      answerIndex: 0,
      explain: 'The silica-rich soil suggested hot water once flowed there — a place life might have liked.',
    },
  },
  {
    id: 'opportunity',
    name: 'Opportunity',
    kind: 'Rover',
    destination: 'mars',
    status: 'silent',
    site: 'Meridiani Planum',
    lat: -1.95,
    lon: -5.53,
    tagline: 'Planned for 90 days, it explored for almost 15 years.',
    log: [
      { label: 'Landed', value: 'Jan 25, 2004' },
      { label: 'Drove', value: '45 km' },
      { label: 'Last contact', value: 'June 10, 2018' },
    ],
    photo: {
      src: '/images/upcoming/opportunity.jpg',
      alt: 'Artist concept of a NASA Mars Exploration Rover exploring Mars',
      credit: 'NASA/JPL/Cornell University (artist concept, PIA04413)',
      sourceUrl: 'https://images.nasa.gov/details/PIA04413',
    },
    voice: ROBOT_VOICE,
    chapters: [
      {
        title: 'A hole-in-one',
        text: "Hi! I'm Opportunity. In January 2004, I bounced across Mars in my airbags and rolled right into a small crater — like a hole-in-one in golf!",
      },
      {
        title: 'Martian blueberries',
        text: 'I found tiny round pebbles everywhere. Scientists called them blueberries. They are made of a mineral called hematite, which usually forms in water. Mars was once a wetter world!',
      },
      {
        title: 'A marathon on Mars',
        text: 'In 2015, I finished a marathon — more than 42 kilometers. In total I drove 45 kilometers, farther than any other vehicle on another world when I stopped.',
      },
      {
        title: 'The great dust storm',
        text: 'In 2018, a huge dust storm wrapped all of Mars. Dust blocked the sunlight my solar panels needed. My last message reached Earth on June 10, 2018. NASA sent more than a thousand calls, hoping I would wake up.',
      },
      {
        title: 'Rest, rover',
        text: 'I was planned to work for 90 days. I worked for almost 15 years. My team said goodbye in February 2019. Everything I learned helped build Curiosity and Perseverance.',
      },
    ],
    question: {
      prompt: 'How long was Opportunity first planned to work?',
      options: ['90 days', '15 years', '1 hour'],
      answerIndex: 0,
      explain: 'Opportunity was built for 90 days and kept exploring for almost 15 years.',
    },
    related: { href: '/levels/curiosity', label: 'Color Curiosity, the next big Mars rover' },
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    kind: 'Robot lander',
    destination: 'mars',
    status: 'silent',
    site: 'Arctic plains',
    lat: 68.22,
    lon: -125.75,
    tagline: 'The lander that touched ice near Mars’s north pole.',
    log: [
      { label: 'Landed', value: 'May 25, 2008' },
      { label: 'Discovery', value: 'Water ice' },
      { label: 'Last contact', value: 'Nov 2, 2008' },
    ],
    photo: {
      src: '/images/legacy/phoenix.jpg',
      alt: 'Two views of a trench dug by Phoenix, showing small white chunks of ice that vanished days later',
      credit: 'NASA/JPL-Caltech/University of Arizona/Texas A&M University (PIA10906)',
      sourceUrl: 'https://images.nasa.gov/details/PIA10906',
    },
    voice: GENTLE_VOICE,
    chapters: [
      {
        title: 'Landing in the Arctic',
        text: "Hi! I'm Phoenix. In May 2008, I fired my rocket engines to land gently on the icy plains near Mars’s north pole.",
      },
      {
        title: 'Dig, dig, dig',
        text: 'My robotic arm dug trenches in the soil. Underneath, I saw small white chunks. A few days later, they had vanished into the thin air! That proved they were water ice.',
      },
      {
        title: 'Snow from the sky',
        text: 'I pointed a laser up at the clouds and saw snow falling from them. It turned into gas before it ever reached the ground.',
      },
      {
        title: 'Winter comes',
        text: 'I was solar powered, and the Arctic winter brought less and less sunlight. My last signal came on November 2, 2008. Later, pictures from orbit showed that heavy winter ice had broken my solar panels.',
      },
    ],
    question: {
      prompt: 'What did Phoenix find just under the Martian soil?',
      options: ['Water ice', 'A fossil', 'An old rover'],
      answerIndex: 0,
      explain: 'White chunks in its trench slowly vanished, proving they were water ice.',
    },
  },
  {
    id: 'insight',
    name: 'InSight',
    kind: 'Robot lander',
    destination: 'mars',
    status: 'silent',
    site: 'Elysium Planitia',
    lat: 4.5,
    lon: 135.62,
    tagline: 'The lander that listened to marsquakes.',
    log: [
      { label: 'Landed', value: 'Nov 26, 2018' },
      { label: 'Marsquakes', value: '1,319' },
      { label: 'Last contact', value: 'Dec 15, 2022' },
    ],
    photo: {
      src: '/images/legacy/insight.jpg',
      alt: 'InSight’s final selfie on Mars, its round solar panels covered in reddish dust',
      credit: 'NASA/JPL-Caltech (PIA25287)',
      sourceUrl: 'https://images.nasa.gov/details/PIA25287',
    },
    voice: GENTLE_VOICE,
    chapters: [
      {
        title: 'A lander with good ears',
        text: "Hi! I'm InSight. Other explorers looked at Mars’s surface. My job was to listen to the inside of the planet.",
      },
      {
        title: 'Shh… marsquakes!',
        text: 'My robotic arm placed a super-sensitive seismometer on the ground. It felt the planet shake. I recorded 1,319 marsquakes! The biggest one, in May 2022, was magnitude 4.7.',
      },
      {
        title: 'X-ray vision with waves',
        text: 'Quake waves change as they travel through rock, a bit like light through glass. By studying them, scientists measured Mars’s crust, its mantle and its large liquid metal core.',
      },
      {
        title: 'A dusty goodbye',
        text: 'Dust slowly covered my solar panels. This is my final selfie, from April 2022. My last message reached Earth on December 15, 2022.',
      },
    ],
    question: {
      prompt: 'What did InSight listen for on Mars?',
      options: ['Marsquakes', 'Music', 'Wind chimes'],
      answerIndex: 0,
      explain: 'InSight’s seismometer recorded 1,319 marsquakes and revealed what Mars is like inside.',
    },
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity',
    kind: 'Helicopter',
    destination: 'mars',
    status: 'silent',
    site: 'Jezero Crater',
    lat: 18.44,
    lon: 77.45,
    tagline: 'The first aircraft to fly on another planet.',
    log: [
      { label: 'First flight', value: 'April 19, 2021' },
      { label: 'Flights', value: '72' },
      { label: 'Last flight', value: 'Jan 18, 2024' },
    ],
    photo: {
      src: '/images/upcoming/ingenuity.jpg',
      alt: 'The flight model of NASA’s Ingenuity Mars Helicopter',
      credit: 'NASA/JPL-Caltech (PIA23882)',
      sourceUrl: 'https://images.nasa.gov/details/PIA23882',
    },
    voice: BRIGHT_VOICE,
    chapters: [
      {
        title: 'A tiny stowaway',
        text: "Hi! I'm Ingenuity, a little helicopter. I rode all the way to Mars tucked under the belly of the Perseverance rover.",
      },
      {
        title: 'The first flight',
        text: 'On April 19, 2021, I lifted off the ground and hovered. It was the first powered, controlled flight on another planet!',
      },
      {
        title: 'Flying in thin air',
        text: 'Mars’s air is about 100 times thinner than Earth’s, so it is very hard to fly. My blades spin about 2,400 times a minute to push enough air.',
      },
      {
        title: '5 flights? No, 72!',
        text: 'I was only planned to make five test flights. I ended up making 72, flying ahead to scout the way for Perseverance.',
      },
      {
        title: 'Grounded, not forgotten',
        text: 'On my 72nd flight in January 2024, my rotor blades were damaged, so I can’t fly anymore. I am still standing on a sand ripple in Jezero Crater, and future Mars helicopters will learn from me.',
      },
    ],
    question: {
      prompt: 'How many flights did Ingenuity make on Mars?',
      options: ['72', '5', '1'],
      answerIndex: 0,
      explain: 'Ingenuity was planned for 5 flights and made 72!',
    },
    related: { href: '/levels/perseverance', label: 'Color Perseverance, its rover partner' },
  },

  /* =========================== DEEP SPACE =========================== */
  {
    id: 'pioneer-10',
    name: 'Pioneer 10',
    kind: 'Space probe',
    destination: 'deep',
    status: 'silent',
    site: 'Heading toward the star Aldebaran',
    whereNow: 'Far beyond Pluto, flying silently',
    tagline: 'The first spacecraft to cross the asteroid belt and visit Jupiter.',
    log: [
      { label: 'Launched', value: 'March 1972' },
      { label: 'Jupiter flyby', value: 'Dec 1973' },
      { label: 'Last signal', value: 'Jan 23, 2003' },
    ],
    photo: {
      src: '/images/legacy/pioneer10.jpg',
      alt: 'The Pioneer 10 spacecraft being prepared for launch, showing where its message plaque is mounted',
      credit: 'NASA Ames (ARC-1972-AC72-2135)',
      sourceUrl: 'https://images.nasa.gov/details/ARC-1972-AC72-2135',
    },
    voice: DEEP_VOICE,
    chapters: [
      {
        title: 'Into the unknown',
        text: "Hello. I'm Pioneer 10. When I launched in March 1972, no spacecraft had ever flown through the asteroid belt. Some people worried I would be smashed to bits.",
      },
      {
        title: 'Through the rocks',
        text: 'I made it safely through! Then, in December 1973, I became the first spacecraft to fly past Jupiter and take close-up pictures of the giant planet.',
      },
      {
        title: 'A message on board',
        text: 'I carry a small metal plaque with a drawing of two humans and a map showing where Earth is — just in case someone, someday, finds me.',
      },
      {
        title: 'Fading away',
        text: 'I kept talking to Earth for more than 30 years. My last faint signal arrived on January 23, 2003. My power had grown too weak.',
      },
      {
        title: 'Still flying',
        text: 'I am still flying, heading in the direction of a red star named Aldebaran. At my speed, it would take me about two million years to get there.',
      },
    ],
    question: {
      prompt: 'Pioneer 10 was the first spacecraft to visit which planet?',
      options: ['Jupiter', 'Venus', 'Earth'],
      answerIndex: 0,
      explain: 'Pioneer 10 crossed the asteroid belt and flew past Jupiter in December 1973.',
    },
  },
  {
    id: 'pioneer-11',
    name: 'Pioneer 11',
    kind: 'Space probe',
    destination: 'deep',
    status: 'silent',
    site: 'Leaving the solar system',
    whereNow: 'Far beyond Pluto, flying silently',
    tagline: 'The first spacecraft to visit Saturn.',
    log: [
      { label: 'Launched', value: 'April 1973' },
      { label: 'Saturn flyby', value: 'Sept 1, 1979' },
      { label: 'Last contact', value: 'Nov 1995' },
    ],
    photo: {
      src: '/images/legacy/pioneer-plaque.jpg',
      alt: 'The gold-colored Pioneer plaque showing a man and a woman and a map of where Earth is',
      credit: 'NASA Ames (ARC-1972-AC72-1338)',
      sourceUrl: 'https://images.nasa.gov/details/ARC-1972-AC72-1338',
    },
    voice: DEEP_VOICE,
    chapters: [
      {
        title: 'Following my sibling',
        text: "Hello. I'm Pioneer 11, Pioneer 10’s twin. I launched in April 1973 and flew past Jupiter in December 1974.",
      },
      {
        title: 'Slingshot to Saturn',
        text: 'Jupiter’s gravity swung me toward Saturn like a slingshot. On September 1, 1979, I became the first spacecraft ever to visit Saturn.',
      },
      {
        title: 'Scouting the rings',
        text: 'I discovered a thin new ring around Saturn and showed it was safe for the Voyagers to fly through the area after me.',
      },
      {
        title: 'Our message',
        text: 'Like my twin, I carry this plaque. It shows two people and a map of where Earth is, in case anyone ever finds me.',
      },
      {
        title: 'The quiet years',
        text: 'My power slowly ran low. The last time Earth heard from me was in November 1995. I am still sailing out of the solar system, silent.',
      },
    ],
    question: {
      prompt: 'Pioneer 11 was the first spacecraft to visit which planet?',
      options: ['Saturn', 'Mars', 'Mercury'],
      answerIndex: 0,
      explain: 'Pioneer 11 reached Saturn on September 1, 1979 — the first spacecraft ever to do so.',
    },
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    kind: 'Space probe',
    destination: 'deep',
    status: 'still-talking',
    site: 'Interstellar space',
    whereNow: 'One light-day from Earth — the farthest human-made object',
    tagline: 'The farthest human-made object, now about one light-day from Earth.',
    log: [
      { label: 'Launched', value: 'Sept 5, 1977' },
      { label: 'Interstellar', value: 'Aug 25, 2012' },
      { label: 'One light-day', value: 'Nov 18, 2026' },
    ],
    photo: {
      src: '/images/legacy/pale-blue-dot.jpg',
      alt: 'The Pale Blue Dot photo: Earth as a tiny bright speck inside a band of scattered sunlight',
      credit: 'NASA/JPL (PIA00452)',
      sourceUrl: 'https://images.nasa.gov/details/PIA00452',
    },
    voice: GENTLE_VOICE,
    chapters: [
      {
        title: 'Hello from very, very far',
        text: "Hello! I'm Voyager 1. I launched on September 5, 1977. I am the farthest object people have ever built.",
        photo: {
          src: '/images/legacy/voyager.jpg',
          alt: 'Artist concept of a Voyager spacecraft with its large white dish antenna',
          credit: 'NASA/JPL-Caltech (PIA14111)',
          sourceUrl: 'https://images.nasa.gov/details/PIA14111',
        },
      },
      {
        title: 'Giants up close',
        text: 'I flew past Jupiter in 1979 and Saturn in 1980. I discovered that Jupiter’s moon Io has active volcanoes — the first ones ever seen beyond Earth!',
      },
      {
        title: 'The Pale Blue Dot',
        text: 'On February 14, 1990, I turned around and took a picture of home. Can you see the tiny dot in the light beam? That’s Earth. Everyone who has ever lived is on that little dot.',
      },
      {
        title: 'A golden record',
        text: 'I carry a golden record with sounds and pictures of Earth: music, whale songs, and greetings in 55 languages.',
        photo: {
          src: '/images/legacy/golden-record.jpg',
          alt: 'The Voyager Golden Record, a gold-plated disc carried on both Voyager spacecraft',
          credit: 'NASA/JPL-Caltech (PIA14113)',
          sourceUrl: 'https://images.nasa.gov/details/PIA14113',
        },
      },
      {
        title: 'One light-day away',
        text: 'In 2012, I flew out of the Sun’s bubble into interstellar space. On November 18, 2026, I reach one light-day from Earth: a radio message takes a whole day to reach me. I still send home a little science every day.',
      },
    ],
    question: {
      prompt: 'What is the “Pale Blue Dot” in Voyager 1’s famous photo?',
      options: ['Earth', 'A blue star', 'A speck of dust on the camera'],
      answerIndex: 0,
      explain: 'In 1990, Voyager 1 photographed Earth from about 6 billion km away — a tiny pale blue dot.',
    },
  },
  {
    id: 'voyager-2',
    name: 'Voyager 2',
    kind: 'Space probe',
    destination: 'deep',
    status: 'still-talking',
    site: 'Interstellar space',
    whereNow: 'Interstellar space, still sending data',
    tagline: 'The only spacecraft that has ever visited Uranus and Neptune.',
    log: [
      { label: 'Launched', value: 'Aug 20, 1977' },
      { label: 'Planets visited', value: '4' },
      { label: 'Interstellar', value: 'Nov 5, 2018' },
    ],
    photo: {
      src: '/images/legacy/voyager.jpg',
      alt: 'Artist concept of a Voyager spacecraft with its large white dish antenna',
      credit: 'NASA/JPL-Caltech (PIA14111)',
      sourceUrl: 'https://images.nasa.gov/details/PIA14111',
    },
    voice: GENTLE_VOICE,
    chapters: [
      {
        title: 'The grand tour',
        text: "Hi! I'm Voyager 2. I actually launched first, on August 20, 1977, sixteen days before my twin, Voyager 1.",
      },
      {
        title: 'Four giant planets',
        text: 'The planets lined up in a rare way, so I could hop from one to the next using their gravity. I visited Jupiter, Saturn, Uranus and Neptune.',
      },
      {
        title: 'The only visitor',
        text: 'I am still the only spacecraft that has ever visited Uranus, in 1986, and Neptune, in 1989. Almost everything we know up close about those icy giants came from me.',
      },
      {
        title: 'Across the border',
        text: 'On November 5, 2018, I crossed out of the Sun’s bubble into interstellar space, just like my twin.',
      },
      {
        title: 'Saving power',
        text: 'My nuclear power source gets a little weaker every year, so engineers turn off instruments one by one to keep me going. I am still talking to Earth with a few of them on.',
        photo: {
          src: '/images/legacy/golden-record.jpg',
          alt: 'The Voyager Golden Record, a gold-plated disc carried on both Voyager spacecraft',
          credit: 'NASA/JPL-Caltech (PIA14113)',
          sourceUrl: 'https://images.nasa.gov/details/PIA14113',
        },
      },
    ],
    question: {
      prompt: 'Which planets has only Voyager 2 ever visited?',
      options: ['Uranus and Neptune', 'Mars and Venus', 'Earth and the Moon'],
      answerIndex: 0,
      explain: 'Voyager 2 flew past Uranus in 1986 and Neptune in 1989 — no other spacecraft has visited them.',
    },
  },
]

export const getExplorer = (id: string) => EXPLORERS.find((e) => e.id === id)

export const explorersAt = (d: Destination) => EXPLORERS.filter((e) => e.destination === d)

/** Equirectangular projection centered on longitude 0 → percentage position on the map image. */
export function toMapPosition(lat: number, lon: number) {
  return { left: ((lon + 180) / 360) * 100, top: ((90 - lat) / 180) * 100 }
}
