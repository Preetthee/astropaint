import type { LevelData, Source } from './types'

const nasa = (label: string, url: string): Source => ({ label, url })
const mars = nasa('NASA Mars Exploration Rover mission', 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/')
const pathfinder = nasa('NASA Mars Pathfinder', 'https://science.nasa.gov/mission/mars-pathfinder/')
const ingenuitySource = nasa('NASA Ingenuity Mars Helicopter', 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/')
const apollo = nasa('NASA Apollo Lunar Roving Vehicle', 'https://www.nasa.gov/history/alsj/alsj-LRV.html')

function makeLevel(config: {
  id: string; order: number; name: string; title: string; tagline: string; mission: string; destination: string;
  facts: LevelData['facts']; description: string; photo: LevelData['photo']; intro: string; completion: string;
  components: [string, string, string, Source[]][]; quiz: [string, string[], number, string, string, Source][];
  colors: Record<string, string>
}): LevelData {
  const regions = ['sky', 'ground', 'vehicle', 'wheel1', 'wheel2', 'wheel3', 'wheel4', 'wheel5', 'wheel6', 'instrument', 'antenna']
  const components = config.components.map(([id, name, text, sources]) => ({
    id, name, shortName: name, line: { text }, takeaway: text, sources,
  }))
  const componentFor: Record<string, string> = {
    sky: config.components[0][0], ground: config.components[0][0], vehicle: config.components[1][0],
    instrument: config.components[3][0], antenna: config.components[4][0],
  }
  for (let i = 1; i <= 6; i++) componentFor[`wheel${i}`] = config.components[2][0]
  return {
    id: config.id, order: config.order, name: config.name, title: config.title, tagline: config.tagline,
    mission: config.mission, facts: config.facts, description: config.description, photo: config.photo,
    voice: { pitch: 1.05, rate: 0.93 }, accent: config.order % 2 ? 'primary' : 'secondary',
    intro: { text: config.intro }, allColored: { text: 'Every part is colored! Tap Finish when you are ready to see what this explorer helped us learn.' },
    completion: { text: config.completion }, components,
    regions: regions.map((id) => ({ id, componentId: componentFor[id], label: ({ sky: `${config.destination} sky`, ground: `${config.destination} ground`, vehicle: `${config.name} body`, instrument: 'science instrument', antenna: 'antenna', wheel1: 'front wheel', wheel2: 'middle wheel', wheel3: 'back wheel', wheel4: 'far front wheel', wheel5: 'far middle wheel', wheel6: 'far back wheel' } as Record<string, string>)[id] })),
    suggestedColors: Object.fromEntries(regions.map((id) => [id, config.colors[id] ?? '#b7bfcc'])),
    quiz: config.quiz.map(([question, options, answerIndex, explanation, hint, source], i) => ({
      id: `${config.id}-${i + 1}`, question, options, answerIndex, explanation, hint,
      image: { src: config.photo.src, alt: config.photo.alt, credit: config.photo.credit, sourceUrl: source.url },
    })),
    passScore: 2, illustrationReferences: [config.photo.sourceUrl ? nasa(config.photo.title, config.photo.sourceUrl) : mars, ...config.components.flatMap((c) => c[3])],
  }
}

const helicopterPhoto = { src: '/images/upcoming/ingenuity.jpg', alt: 'NASA Ingenuity Mars Helicopter', title: 'Ingenuity Mars Helicopter', credit: 'NASA/JPL-Caltech', sourceUrl: 'https://images.nasa.gov/details/PIA23882' }
const opportunityPhoto = { src: '/images/upcoming/opportunity.jpg', alt: 'Artist concept of a Mars Exploration Rover', title: 'Mars Exploration Rover', credit: 'NASA/JPL/Cornell University (artist concept)', sourceUrl: 'https://images.nasa.gov/details/PIA04413' }
const sojournerPhoto = { src: '/images/upcoming/sojourner.jpg', alt: 'Sojourner rover beside a rock on Mars', title: 'Sojourner on Mars', credit: 'NASA/JPL', sourceUrl: 'https://images.nasa.gov/details/PIA01122' }
const lunarPhoto = { src: '/images/upcoming/lunar-rover.jpg', alt: 'Apollo astronaut beside the Lunar Roving Vehicle', title: 'Apollo Lunar Roving Vehicle', credit: 'NASA', sourceUrl: 'https://images.nasa.gov/details/as15-86-11603' }

export const ingenuity = makeLevel({
  id: 'ingenuity', order: 3, name: 'Ingenuity', title: 'Fly with Ingenuity', tagline: 'The first helicopter on another world', mission: 'Mars 2020', destination: 'Mars', photo: helicopterPhoto,
  facts: [{ label: 'First flight', value: 'Apr 19, 2021' }, { label: 'Flights', value: '72' }, { label: 'Final flight', value: 'Jan 2024' }],
  description: 'Ingenuity began as a tiny flight experiment. Its 72 flights proved that powered flight could work in Mars’ thin air and helped Perseverance explore.',
  intro: 'Hi! I am Ingenuity, a small helicopter that flew on Mars. My test flights showed future explorers how to scout the way from the sky. Tap my parts to learn how I flew!',
  completion: 'You learned how my blades, solar panel, cameras and tiny body helped me make history as the first powered aircraft to fly on another planet.',
  components: [['landscape','Mars landscape','Mars has a very thin atmosphere. My blades had to spin quickly to lift me there.',[ingenuitySource]],['body','Fuselage','My small body carried my computers, batteries, cameras and radio.',[ingenuitySource]],['wheels','Landing legs','Four light landing legs helped me touch down gently after each flight.',[ingenuitySource]],['science','Navigation cameras','My navigation camera watched the ground so my computer could estimate where I was moving.',[ingenuitySource]],['radio','Solar panel and antenna','My solar panel charged my batteries, and my radio relayed information through Perseverance to Earth.',[ingenuitySource]]],
  quiz: [['What made Ingenuity historic?',['First powered, controlled flight on another planet','First rover on Mars','First spacecraft to orbit Earth'],0,'Ingenuity made the first powered, controlled flights on another planet.','It flew above the Martian ground.',ingenuitySource],['How many flights did Ingenuity complete?',['7','72','720'],1,'Ingenuity completed 72 flights before its mission ended.','It flew far beyond its original five-flight goal.',ingenuitySource],['How did Ingenuity get power?',['Solar panel and batteries','Gasoline engine','A long cable to Earth'],0,'Its solar panel charged batteries that powered the helicopter.','Look on top of the helicopter.',ingenuitySource]],
  colors: { sky:'#e9c99a', ground:'#d9482b', vehicle:'#f3f1ea', instrument:'#6d7585', antenna:'#3a3f4f' },
})

export const opportunity = makeLevel({
  id: 'opportunity', order: 4, name: 'Opportunity', title: 'Remember Opportunity', tagline: 'The rover that kept going', mission: 'Mars Exploration Rover', destination: 'Mars', photo: opportunityPhoto,
  facts: [{ label: 'Landed', value: 'Jan 25, 2004' }, { label: 'Planned mission', value: '90 sols' }, { label: 'Drove', value: '45.16 km' }],
  description: 'Opportunity found evidence that ancient water once flowed on Mars. Designed for 90 Martian days, it worked for nearly 15 years before a planet-wide dust storm ended contact.',
  intro: 'I am Opportunity. My planned 90-day mission became an adventure lasting almost 15 years! I studied rocks and soil for clues that water once changed Mars.',
  completion: 'Opportunity’s long journey showed that Mars once had wet environments. Its record-breaking drive inspired rover explorers that followed.',
  components: [['landscape','Meridiani Planum','I explored a flat plain where my instruments found signs that liquid water had affected rocks long ago.',[mars]],['body','Rover body','My warm electronics box protected the computers that planned drives and studied science data.',[mars]],['wheels','Six wheels','Six wheels and a rocker-bogie suspension helped me cross rocks and sandy ground.',[mars]],['science','Rock instruments','My cameras, microscope and spectrometers examined rocks and soil for minerals and signs of past water.',[mars]],['radio','Communications antenna','I sent data to Earth directly or by relaying it through spacecraft orbiting Mars.',[mars]]],
  quiz: [['What evidence did Opportunity find?',['Signs that water once changed rocks','Living dinosaurs','A frozen ocean today'],0,'Opportunity found minerals and textures showing that liquid water had affected rocks.','The discovery was about Mars’ watery past.',mars],['How long was the planned mission?',['90 Martian days','15 years','One week'],0,'The mission was planned for 90 sols, but Opportunity worked for nearly 15 years.','A sol is one Martian day.',mars],['What ended contact with Opportunity?',['A planet-wide dust storm','A broken wheel on day one','It flew away'],0,'A severe dust storm blocked sunlight, and NASA ended attempts to contact the rover in 2019.','The rover relied on sunlight for power.',mars]],
  colors: { sky:'#e9c99a', ground:'#9a5b3c', vehicle:'#f3f1ea', instrument:'#6d7585', antenna:'#b7bfcc' },
})

export const sojourner = makeLevel({
  id: 'sojourner', order: 5, name: 'Sojourner', title: 'Meet Sojourner', tagline: 'A small rover with a giant first step', mission: 'Mars Pathfinder', destination: 'Mars', photo: sojournerPhoto,
  facts: [{ label: 'Landed', value: 'Jul 4, 1997' }, { label: 'Mission', value: 'Pathfinder' }, { label: 'Rover mass', value: '10.6 kg' }],
  description: 'Sojourner became the first successful rover on Mars. It rolled down from the Pathfinder lander, tested nearby rocks and proved a small mobile robot could explore another world.',
  intro: 'Hello! I am Sojourner, the first rover to explore Mars. My Pathfinder home helped me roll onto the ground, visit rocks and send pictures back to Earth.',
  completion: 'Sojourner was small, but its success helped engineers design bigger rovers. It showed that a robot could safely explore beyond its landing spot.',
  components: [['landscape','Ares Vallis','I explored Ares Vallis, a plain where rocks may have been carried by ancient floods.',[pathfinder]],['body','Rover body','My small body held my computer, batteries and radio. I was about the size of a microwave oven.',[pathfinder]],['wheels','Six wheels','Six wheels let me crawl over rocks and test how a rover could move across Mars.',[pathfinder]],['science','Alpha Proton X-ray Spectrometer','My APXS instrument measured the elements in rocks and soil to compare different materials.',[pathfinder]],['radio','Antennas','I communicated with Earth through my Pathfinder lander, which acted like a radio base station.',[pathfinder]]],
  quiz: [['What was Sojourner’s big first?',['First successful rover on Mars','First astronaut on Mars','First Mars orbiter'],0,'Sojourner was the first successful rover to operate on Mars.','It was a small wheeled explorer.',pathfinder],['How did Sojourner usually send information to Earth?',['Through its Pathfinder lander','By shining a flashlight','By launching a rocket'],0,'The rover sent data to Pathfinder, which relayed it to Earth.','Its lander stayed nearby as a communication link.',pathfinder],['What did the APXS instrument study?',['Elements in rocks and soil','Weather on Jupiter','Stars in the sky'],0,'APXS measured the elements in Martian rocks and soil.','Its full name includes “X-ray spectrometer.”',pathfinder]],
  colors: { sky:'#e9c99a', ground:'#d9482b', vehicle:'#ffd23f', instrument:'#6d7585', antenna:'#b7bfcc' },
})

export const lunarRover = makeLevel({
  id: 'lunar-rover', order: 6, name: 'Lunar Roving Vehicle', title: 'Drive the Moon with Apollo', tagline: 'The electric car that carried astronauts farther', mission: 'Apollo 15, 16 & 17', destination: 'Moon', photo: lunarPhoto,
  facts: [{ label: 'First driven', value: '1971' }, { label: 'Crew', value: 'Two astronauts' }, { label: 'Top speed', value: 'About 13 km/h' }],
  description: 'The battery-powered Lunar Roving Vehicle let Apollo astronauts travel farther from their landers, gather more samples and investigate the Moon’s mountains and valleys.',
  intro: 'Welcome to the Moon! I am the Lunar Roving Vehicle. Astronauts unfolded me after landing, climbed aboard and drove to rocks and places too far to reach on foot.',
  completion: 'The lunar rover extended astronauts’ reach and helped them bring home more samples. The parked rovers remain on the Moon as reminders of those field trips.',
  components: [['landscape','Lunar surface','I drove over dusty lunar ground, carrying astronauts and tools to interesting rocks and craters.',[apollo]],['body','Chassis and seats','My lightweight frame carried two suited astronauts, tools and collected lunar samples.',[apollo]],['wheels','Four wire-mesh wheels','Four flexible wire-mesh wheels with metal treads gripped the Moon’s rough surface in low gravity.',[apollo]],['science','Navigation and tools','A dashboard display helped astronauts track direction and distance while they collected samples and took photographs.',[apollo]],['radio','Antenna','My antenna sent television and voice signals from the astronauts back to Earth.',[apollo]]],
  quiz: [['What powered the Lunar Roving Vehicle?',['Batteries','Gasoline','A sail'],0,'The lunar rover ran on batteries and electric motors.','It had no exhaust pipe.',apollo],['Which Apollo missions used lunar rovers?',['Apollo 15, 16 and 17','Apollo 11 only','Every Apollo mission'],0,'Astronauts drove lunar rovers on Apollo 15, 16 and 17.','The first lunar rover arrived in 1971.',apollo],['Why use a rover on the Moon?',['To travel farther and collect more samples','To launch astronauts into orbit','To make oxygen'],0,'The rover let astronauts explore farther from their lander and bring back more samples.','It was an electric car for lunar field trips.',apollo]],
  colors: { sky:'#f3f1ea', ground:'#b7bfcc', vehicle:'#ffd23f', instrument:'#6d7585', antenna:'#b7bfcc' },
})
