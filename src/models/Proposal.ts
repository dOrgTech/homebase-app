export interface Proposal {
  id?: string
  title: string
  description: string
  externalLink: string
  choices: string[]
  startTime: number
  endTime: number
  daoID: string
}

interface Choice {
  index: number
  description: string
}
