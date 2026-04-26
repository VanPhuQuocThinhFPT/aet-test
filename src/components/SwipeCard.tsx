import { useState, useRef } from 'react'
import { X, Heart, MapPin, Star, GitFork as Github, Link as Linkedin } from 'lucide-react'
import type { Profile } from '../types'
import { SkillBadge } from './SkillBadge'
import '../styles/SwipeCard.css'

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

interface SwipeCardProps {
  profile: Profile
  onSwipe: (direction: 'left' | 'right') => void
  isTop: boolean
}

export function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTop) return
    startX.current = e.clientX
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isTop) return
    setDragX(e.clientX - startX.current)
  }

  const handleMouseUp = () => {
    if (!isDragging || !isTop) return
    setIsDragging(false)
    if (dragX > 80) {
      onSwipe('right')
    } else if (dragX < -80) {
      onSwipe('left')
    } else {
      setDragX(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTop) return
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isTop) return
    setDragX(e.touches[0].clientX - startX.current)
  }

  const handleTouchEnd = () => {
    if (!isDragging || !isTop) return
    setIsDragging(false)
    if (dragX > 80) {
      onSwipe('right')
    } else if (dragX < -80) {
      onSwipe('left')
    } else {
      setDragX(0)
    }
  }

  const rotation = dragX * 0.08
  const likeOpacity = Math.min(dragX / 80, 1)
  const nopeOpacity = Math.min(-dragX / 80, 1)

  return (
    <div
      ref={cardRef}
      className={`swipe-card ${isTop ? 'swipe-card--top' : 'swipe-card--back'} ${isDragging ? 'dragging' : ''}`}
      style={isTop ? {
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        cursor: isDragging ? 'grabbing' : 'grab',
      } : {}}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="swipe-label swipe-label--like"
        style={{ opacity: likeOpacity }}
      >
        CONNECT
      </div>
      <div
        className="swipe-label swipe-label--nope"
        style={{ opacity: nopeOpacity }}
      >
        PASS
      </div>

      <img
        src={profile.avatar_url}
        alt={profile.name}
        className="swipe-card-image"
        draggable={false}
      />

      <div className="swipe-card-content">
        <div className="swipe-card-name-row">
          <h2 className="swipe-card-name">{profile.name}</h2>
          {profile.is_available && <span className="available-dot-lg" />}
        </div>

        <div className="swipe-card-meta">
          <span
            className="exp-badge-lg"
            style={{ '--exp-color': experienceColors[profile.experience_level] } as React.CSSProperties}
          >
            <Star size={11} fill="currentColor" />
            {profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)} Dev
          </span>
          {profile.location && (
            <span className="location-lg">
              <MapPin size={13} />
              {profile.location}
            </span>
          )}
        </div>

        <span className="looking-for-lg">{lookingForLabels[profile.looking_for]}</span>

        <p className="swipe-card-bio">{profile.bio}</p>

        {profile.skills && profile.skills.length > 0 && (
          <div className="swipe-card-skills">
            {profile.skills.slice(0, 5).map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
            {profile.skills.length > 5 && (
              <span className="skills-more">+{profile.skills.length - 5}</span>
            )}
          </div>
        )}

        <div className="swipe-card-links">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
              className="card-link" onClick={(e) => e.stopPropagation()}>
              <Github size={14} /> GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="card-link" onClick={(e) => e.stopPropagation()}>
              <Linkedin size={14} /> LinkedIn
            </a>
          )}
        </div>
      </div>

      {isTop && (
        <div className="swipe-card-actions">
          <button className="swipe-btn swipe-btn--pass" onClick={() => onSwipe('left')}>
            <X size={22} strokeWidth={3} />
          </button>
          <button className="swipe-btn swipe-btn--connect" onClick={() => onSwipe('right')}>
            <Heart size={22} fill="white" />
          </button>
        </div>
      )}
    </div>
  )
}
