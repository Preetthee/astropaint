export interface VoiceLine {
  /** Text shown in the dialogue panel and spoken by text-to-speech. */
  text: string
  /**
   * Optional prerecorded audio file (e.g. "/audio/perseverance/intro.mp3").
   * When present it is played instead of speech synthesis.
   */
  audioSrc?: string
}

export interface Source {
  label: string
  url: string
}

export interface RoverComponent {
  id: string
  name: string
  /** Short label for chips and summaries. */
  shortName: string
  /** What the rover says when the child taps this part. */
  line: VoiceLine
  /** One-sentence takeaway for the "What you learned" summary. */
  takeaway: string
  sources: Source[]
}

export interface ColorRegion {
  id: string
  componentId: string
  /** Accessible label, e.g. "front wheel". */
  label: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  answerIndex: number
  /** Friendly explanation read after answering. */
  explanation: string
}

export interface VoiceProfile {
  pitch: number
  rate: number
}

export interface LevelData {
  id: string
  order: number
  name: string
  title: string
  tagline: string
  mission: string
  facts: { label: string; value: string }[]
  description: string
  photo: { src: string; alt: string; credit: string; sourceUrl: string; title: string }
  voice: VoiceProfile
  /** Theme accent for character avatar & badges. */
  accent: 'primary' | 'secondary'
  intro: VoiceLine
  allColored: VoiceLine
  completion: VoiceLine
  components: RoverComponent[]
  regions: ColorRegion[]
  quiz: QuizQuestion[]
  /** Minimum correct answers to unlock the next level. */
  passScore: number
  illustrationReferences: Source[]
}
