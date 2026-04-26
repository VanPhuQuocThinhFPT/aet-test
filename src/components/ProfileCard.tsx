import { MapPin, ExternalLink, Star } from 'lucide-react'
import type { Profile } from '../types'
import { SkillBadge } from './SkillBadge'
import '../styles/ProfileCard.css'

const experienceColors: Record<string, string> = {
  junior: '#22c55e',
  mid: '#3b82f6',
  senior: '#f59e0b',
  lead: '#ef4444',
}

const lookingForLabels: Record<string, string> = {
  teammate: 'Looking for Teammate',
  mentor: 'Seeking Mentor',
  mentee: 'Open to Mentoring',
  collaborator: 'Open to Collaboration',
}

interface ProfileCardProps {
  profile: Profile
  compact?: boolean
}

export function ProfileCard({ profile, compact = false }: ProfileCardProps) {
  return (
    <div className={`profile-card ${compact ? 'profile-card--compact' : ''}`}>
      <div className="profile-card-header">
        <img
          src={profile.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={profile.name}
          className="profile-avatar"
        />
        <div className="profile-info">
          <div className="profile-name-row">
            <h3 className="profile-name">{profile.name}</h3>
            {profile.is_available && <span className="available-dot" title="Available" />}
          </div>
          <div className="profile-meta">
            <span
              className="experience-badge"
              style={{ '--exp-color': experienceColors[profile.experience_level] } as React.CSSProperties}
            >
              <Star size={10} fill="currentColor" />
              {profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)}
            </span>
            {profile.location && (
              <span className="location">
                <MapPin size={12} />
                {profile.location}
              </span>
            )}
          </div>
          <span className="looking-for-label">{lookingForLabels[profile.looking_for]}</span>
        </div>
      </div>

      {!compact && (
        <p className="profile-bio">{profile.bio}</p>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <div className="profile-skills">
          {profile.skills.slice(0, compact ? 3 : 6).map((skill) => (
            <SkillBadge key={skill.id} skill={skill} size={compact ? 'sm' : 'md'} />
          ))}
          {profile.skills.length > (compact ? 3 : 6) && (
            <span className="skills-more">+{profile.skills.length - (compact ? 3 : 6)}</span>
          )}
        </div>
      )}

      {!compact && (
        <div className="profile-links">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="profile-link">
              <ExternalLink size={15} />
              GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="profile-link">
              <ExternalLink size={15} />
              LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  )
}
