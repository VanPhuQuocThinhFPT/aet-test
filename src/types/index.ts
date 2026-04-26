export interface Skill {
  id: string
  name: string
  category: string
  color: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  avatar_url: string
  bio: string
  location: string
  experience_level: 'junior' | 'mid' | 'senior' | 'lead'
  github_url: string
  linkedin_url: string
  looking_for: 'teammate' | 'mentor' | 'mentee' | 'collaborator'
  is_available: boolean
  created_at: string
  updated_at: string
  skills?: Skill[]
}

export interface Project {
  id: string
  profile_id: string
  title: string
  description: string
  status: 'idea' | 'in_progress' | 'completed'
  tech_stack: string[]
  team_size: number
  created_at: string
}

export interface Match {
  id: string
  swiper_id: string
  swiped_id: string
  direction: 'left' | 'right'
  is_match: boolean
  created_at: string
  profile?: Profile
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
}

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead'
export type LookingFor = 'teammate' | 'mentor' | 'mentee' | 'collaborator'
