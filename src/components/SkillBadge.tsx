import type { Skill } from '../types'
import '../styles/SkillBadge.css'

interface SkillBadgeProps {
  skill: Skill
  size?: 'sm' | 'md'
}

export function SkillBadge({ skill, size = 'md' }: SkillBadgeProps) {
  return (
    <span
      className={`skill-badge skill-badge--${size}`}
      style={{ '--skill-color': skill.color } as React.CSSProperties}
    >
      <span className="skill-dot" />
      {skill.name}
    </span>
  )
}
