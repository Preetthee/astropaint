import type { LevelData, Source } from './types'

const SRC = {
  mission: {
    label: 'NASA — Mars Science Laboratory: Curiosity Rover',
    url: 'https://science.nasa.gov/mission/msl-curiosity/',
  },
  instruments: {
    label: 'NASA — Curiosity Science Instruments',
    url: 'https://science.nasa.gov/mission/msl-curiosity/science-instruments/',
  },
  wheels: {
    label: 'NASA — Perseverance vs. Curiosity wheels (Rover Components)',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/rover-components/',
  },
} satisfies Record<string, Source>

export const curiosity: LevelData = {
  id: 'curiosity',
  order: 2,
  name: 'Curiosity',
  title: 'Discover NASA Curiosity',
  tagline: 'The rover with a laser and a lab inside',
  mission: 'Mars Science Laboratory',
  facts: [
    { label: 'Landed', value: 'Aug 6, 2012' },
    { label: 'Where', value: 'Gale Crater' },
    { label: 'Cameras', value: '17' },
  ],
  description:
    'Curiosity climbs Mount Sharp in Gale Crater, drilling rocks and testing them in its onboard labs to learn if Mars could once support tiny life.',
  photo: {
    src: '/images/curiosity-selfie.jpg',
    alt: 'Real photo: NASA’s Curiosity rover selfie at the “Buckskin” drill site on Mars, seen from a low angle.',
    title: 'Looking Up at Mars Rover Curiosity in “Buckskin” Selfie (PIA19808)',
    credit: 'NASA/JPL-Caltech/MSSS',
    sourceUrl: 'https://images.nasa.gov/details/PIA19808',
  },
  voice: { pitch: 0.95, rate: 0.92 },
  accent: 'secondary',
  intro: {
    text: "Hello there! I'm Curiosity. I've been exploring Mars since 2012. Let's discover how I investigate this amazing planet! Choose a color and tap any part of me.",
  },
  allColored: {
    text: 'Amazing! Every part of me is colored. Tap the Finish button when you are ready.',
  },
  completion: {
    text: "Wonderful work, scientist! You've learned how I study rocks, air and radiation on Mars. Let's keep exploring together!",
  },
  components: [
    {
      id: 'mastcam',
      name: 'Mastcam cameras',
      shortName: 'Mastcam',
      line: {
        text: 'These are my Mastcam cameras, on top of my mast, about as high as a grown-up’s eyes. They take color pictures and videos of Mars. One eye zooms in more than the other!',
      },
      takeaway: 'Mastcam takes color pictures and videos of Mars.',
      sources: [SRC.instruments],
    },
    {
      id: 'chemcam',
      name: 'ChemCam',
      shortName: 'ChemCam',
      line: {
        text: 'ChemCam is the big round eye on my forehead. It zaps rocks with a laser, then reads the glowing light to learn what the rocks are made of!',
      },
      takeaway: 'ChemCam zaps rocks with a laser to learn what they are made of.',
      sources: [SRC.instruments],
    },
    {
      id: 'arm',
      name: 'Robotic arm',
      shortName: 'Robotic arm',
      line: {
        text: 'My robotic arm is about 7 feet long. Its hand, called a turret, holds my drill, a camera and other science tools close to rocks.',
      },
      takeaway: 'Curiosity’s robotic arm holds its drill, camera and tools close to rocks.',
      sources: [SRC.mission, SRC.instruments],
    },
    {
      id: 'drill',
      name: 'Drill',
      shortName: 'Drill',
      line: {
        text: 'This is my drill! It makes small holes in rocks and collects the powdered rock. Then I pour the powder into the labs inside my body to study it. I have drilled more than 40 holes!',
      },
      takeaway: 'The drill collects powdered rock for Curiosity’s onboard labs.',
      sources: [SRC.mission],
    },
    {
      id: 'mahli',
      name: 'MAHLI camera',
      shortName: 'MAHLI',
      line: {
        text: 'MAHLI is a camera on my hand, like a geologist’s magnifying glass. It takes super close-up pictures of rocks, and it even takes my selfies!',
      },
      takeaway: 'MAHLI takes close-up pictures of rocks, and Curiosity’s selfies.',
      sources: [SRC.instruments, SRC.mission],
    },
    {
      id: 'sam',
      name: 'Sample Analysis at Mars (SAM)',
      shortName: 'SAM',
      line: {
        text: 'SAM is a science lab inside the front of my body. It is about the size of a microwave oven! It heats rock powder in tiny ovens to look for organic molecules, the building blocks of life.',
      },
      takeaway: 'SAM heats rock powder to look for organic molecules.',
      sources: [SRC.instruments],
    },
    {
      id: 'rad',
      name: 'Radiation Assessment Detector (RAD)',
      shortName: 'RAD',
      line: {
        text: 'RAD sits on my deck and points up at the sky. It measures radiation on Mars, so scientists can learn how to keep future astronauts safe.',
      },
      takeaway: 'RAD measures radiation to help protect future astronauts.',
      sources: [SRC.instruments],
    },
    {
      id: 'wheels',
      name: 'Wheels and rocker-bogie legs',
      shortName: 'Wheels',
      line: {
        text: 'I roll on six aluminum wheels. Each has its own motor, and zigzag treads that help me grip the ground as I climb!',
      },
      takeaway: 'Curiosity rolls on six aluminum wheels with zigzag treads.',
      sources: [SRC.wheels, SRC.mission],
    },
    {
      id: 'body',
      name: 'Rover body',
      shortName: 'Body',
      line: {
        text: 'This is my body. It protects my computer brain, and my onboard science labs.',
      },
      takeaway: 'Curiosity’s body protects its computer and science labs.',
      sources: [SRC.mission],
    },
    {
      id: 'power',
      name: 'Power source (MMRTG)',
      shortName: 'Power',
      line: {
        text: 'This is my power source, at my back end. It is called an MMRTG. It turns heat into electricity, so I can keep working through the Martian night.',
      },
      takeaway: 'Curiosity’s MMRTG power source turns heat into electricity.',
      sources: [SRC.mission],
    },
    {
      id: 'antenna',
      name: 'High-gain antenna',
      shortName: 'Antenna',
      line: {
        text: 'This hexagon is my high-gain antenna. I use it to send messages straight to Earth!',
      },
      takeaway: 'The high-gain antenna sends messages straight to Earth.',
      sources: [SRC.mission],
    },
    {
      id: 'gale',
      name: 'Gale Crater and Mount Sharp',
      shortName: 'Mount Sharp',
      line: {
        text: 'This is Gale Crater, and that big layered mountain is Mount Sharp! I have been climbing it for years, reading its rock layers like pages in a history book.',
      },
      takeaway: 'Curiosity explores Gale Crater and climbs Mount Sharp.',
      sources: [SRC.mission],
    },
  ],
  regions: [
    { id: 'sky', componentId: 'gale', label: 'Mars sky' },
    { id: 'mountain', componentId: 'gale', label: 'Mount Sharp' },
    { id: 'ground', componentId: 'gale', label: 'Gale Crater ground' },
    { id: 'mmrtg', componentId: 'power', label: 'power source' },
    { id: 'hga', componentId: 'antenna', label: 'high-gain antenna' },
    { id: 'rad', componentId: 'rad', label: 'RAD' },
    { id: 'mast', componentId: 'mastcam', label: 'camera mast' },
    { id: 'chemcam', componentId: 'chemcam', label: 'ChemCam head' },
    { id: 'mastcam', componentId: 'mastcam', label: 'Mastcam cameras' },
    { id: 'deck', componentId: 'body', label: 'top deck' },
    { id: 'body', componentId: 'body', label: 'rover body' },
    { id: 'sam', componentId: 'sam', label: 'SAM lab' },
    { id: 'bogie', componentId: 'wheels', label: 'bogie leg' },
    { id: 'rocker', componentId: 'wheels', label: 'rocker leg' },
    { id: 'wheel-rear', componentId: 'wheels', label: 'rear wheel' },
    { id: 'wheel-middle', componentId: 'wheels', label: 'middle wheel' },
    { id: 'wheel-front', componentId: 'wheels', label: 'front wheel' },
    { id: 'arm-upper', componentId: 'arm', label: 'upper robotic arm' },
    { id: 'arm-lower', componentId: 'arm', label: 'lower robotic arm' },
    { id: 'turret', componentId: 'arm', label: 'arm turret' },
    { id: 'drill', componentId: 'drill', label: 'drill' },
    { id: 'mahli', componentId: 'mahli', label: 'MAHLI camera' },
  ],
  quiz: [
    {
      id: 'c1',
      question: 'When did Curiosity land on Mars?',
      options: ['1969', '2012', '2021', '2030'],
      answerIndex: 1,
      explanation: 'Curiosity landed in Gale Crater in August 2012.',
    },
    {
      id: 'c2',
      question: 'What does Curiosity use its drill for?',
      options: [
        'Collecting powdered rock to study',
        'Digging a swimming pool',
        'Planting trees',
        'Fixing its wheels',
      ],
      answerIndex: 0,
      explanation: 'The drill collects powdered rock for the labs inside Curiosity.',
    },
    {
      id: 'c3',
      question: 'How does ChemCam learn what a rock is made of?',
      options: ['It paints the rock', 'It zaps it with a laser', 'It sings to it', 'It kicks it'],
      answerIndex: 1,
      explanation: 'ChemCam zaps rocks with a laser and reads the glowing light.',
    },
    {
      id: 'c4',
      question: 'What does RAD measure?',
      options: [
        'How fast the rover drives',
        'The color of the sky',
        'Radiation, to help keep future astronauts safe',
        'How many rocks there are',
      ],
      answerIndex: 2,
      explanation: 'RAD measures radiation to help protect future astronauts.',
    },
    {
      id: 'c5',
      question: 'What does SAM look for in rock powder?',
      options: ['Gold coins', 'Organic molecules', 'Dinosaur bones', 'Chocolate'],
      answerIndex: 1,
      explanation: 'SAM looks for organic molecules, the building blocks of life.',
    },
  ],
  passScore: 3,
  illustrationReferences: [
    {
      label: 'Curiosity “Buckskin” Selfie (PIA19808) — NASA/JPL-Caltech/MSSS',
      url: 'https://images.nasa.gov/details/PIA19808',
    },
    SRC.instruments,
    { label: 'NASA 3D Resources', url: 'https://science.nasa.gov/3d-resources/' },
  ],
}
