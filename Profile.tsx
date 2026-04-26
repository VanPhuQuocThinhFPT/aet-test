import { useState } from 'react'
import { MapPin, GitFork as Github, Link as Linkedin, CreditCard as Edit3, Check, X, Plus, Star } from 'lucide-react'
import { SkillBadge } from '../components/SkillBadge'
import { myProfile, mockSkills, mockProjects } from '../data/mockProfiles'
import '../styles/Profile.css'

const experienceOptions = ['junior', 'mid', 'senior', 'lead'] as const
const lookingForOptions = ['teammate', 'mentor', 'mentee', 'collaborator'] as const

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

const projectStatusColor: Record<string, string> = {
  idea: '#f59e0b',
  in_progress: '#3b82f6',
  completed: '#22c55e',
}

export function Profile() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(myProfile)
  const [draft, setDraft] = useState(myProfile)
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills'>('overview')

  const handleSave = () => {
    setProfile(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(profile)
    setEditing(false)
  }

  const toggleSkill = (skill: typeof mockSkills[0]) => {
    const has = draft.skills?.find(s => s.id === skill.id)
    if (has) {
      setDraft(d => ({ ...d, skills: d.skills?.filter(s => s.id !== skill.id) }))
    } else {
      setDraft(d => ({ ...d, skills: [...(d.skills || []), skill] }))
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-cover" />

      <div className="profile-content">
        <div className="profile-hero">
          <div className="profile-hero-left">
            <div className="profile-avatar-wrap">
              <img src={profile.avatar_url} alt={profile.name} className="profile-hero-avatar" />
              {profile.is_available && <span className="available-badge">Available</span>}
            </div>
            <div className="profile-hero-info">
              {editing ? (
                <input
                  className="edit-input edit-input--name"
                  value={draft.name}
                  onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                />
              ) : (
                <h1 className="profile-hero-name">{profile.name}</h1>
              )}
              <div className="profile-hero-meta">
                <span
                  className="hero-exp-badge"
                  style={{ '--exp-color': experienceColors[profile.experience_level] } as React.CSSProperties}
                >
                  <Star size={11} fill="currentColor" />
                  {profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)} Developer
                </span>
                <span className="hero-looking-for">{lookingForLabels[profile.looking_for]}</span>
              </div>
              {profile.location && (
                <div className="profile-location">
                  <MapPin size={14} />
                  {profile.location}
                </div>
              )}
            </div>
          </div>

          <div className="profile-hero-actions">
            {editing ? (
              <>
                <button className="hero-btn hero-btn--save" onClick={handleSave}>
                  <Check size={16} /> Save Changes
                </button>
                <button className="hero-btn hero-btn--cancel" onClick={handleCancel}>
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <button className="hero-btn hero-btn--edit" onClick={() => setEditing(true)}>
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-links-row">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="social-link">
              <Github size={15} /> GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-link">
              <Linkedin size={15} /> LinkedIn
            </a>
          )}
        </div>

        <div className="profile-tabs">
          {(['overview', 'projects', 'skills'] as const).map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="profile-tab-content">
            <div className="profile-grid">
              <div className="profile-main-col">
                <section className="profile-section">
                  <h2 className="section-title">About Me</h2>
                  {editing ? (
                    <textarea
                      className="edit-textarea"
                      value={draft.bio}
                      onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                      rows={4}
                    />
                  ) : (
                    <p className="profile-bio-text">{profile.bio}</p>
                  )}
                </section>

                <section className="profile-section">
                  <h2 className="section-title">Top Skills</h2>
                  <div className="profile-skills-display">
                    {profile.skills?.map(skill => (
                      <SkillBadge key={skill.id} skill={skill} />
                    ))}
                  </div>
                </section>
              </div>

              <div className="profile-side-col">
                <section className="profile-section">
                  <h2 className="section-title">Details</h2>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Experience Level</span>
                      {editing ? (
                        <select
                          className="edit-select"
                          value={draft.experience_level}
                          onChange={e => setDraft(d => ({ ...d, experience_level: e.target.value as typeof draft.experience_level }))}
                        >
                          {experienceOptions.map(opt => (
                            <option key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className="hero-exp-badge"
                          style={{ '--exp-color': experienceColors[profile.experience_level] } as React.CSSProperties}
                        >
                          <Star size={10} fill="currentColor" />
                          {profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)}
                        </span>
                      )}
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Looking For</span>
                      {editing ? (
                        <select
                          className="edit-select"
                          value={draft.looking_for}
                          onChange={e => setDraft(d => ({ ...d, looking_for: e.target.value as typeof draft.looking_for }))}
                        >
                          {lookingForOptions.map(opt => (
                            <option key={opt} value={opt}>
                              {lookingForLabels[opt]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="detail-value">{lookingForLabels[profile.looking_for]}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Location</span>
                      {editing ? (
                        <input
                          className="edit-input"
                          value={draft.location}
                          onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
                        />
                      ) : (
                        <span className="detail-value">{profile.location || '—'}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Available</span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={editing ? draft.is_available : profile.is_available}
                          onChange={e => editing && setDraft(d => ({ ...d, is_available: e.target.checked }))}
                          disabled={!editing}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>
                </section>

                <section className="profile-section">
                  <h2 className="section-title">Stats</h2>
                  <div className="stats-mini">
                    <div className="stat-mini-item">
                      <span className="stat-mini-value">142</span>
                      <span className="stat-mini-label">Profile Views</span>
                    </div>
                    <div className="stat-mini-item">
                      <span className="stat-mini-value">23</span>
                      <span className="stat-mini-label">Matches</span>
                    </div>
                    <div className="stat-mini-item">
                      <span className="stat-mini-value">8</span>
                      <span className="stat-mini-label">Connections</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="profile-tab-content">
            <div className="projects-header-row">
              <h2 className="section-title">Projects</h2>
              <button className="add-project-btn">
                <Plus size={16} /> Add Project
              </button>
            </div>
            <div className="projects-grid">
              {mockProjects.map(project => (
                <div key={project.id} className="project-card-full">
                  <div className="project-card-header">
                    <h3 className="project-title">{project.title}</h3>
                    <span
                      className="project-status"
                      style={{ '--status-color': projectStatusColor[project.status] } as React.CSSProperties}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tech">
                    {project.tech_stack.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="profile-tab-content">
            <div className="skills-management">
              <div className="skills-section">
                <h3 className="skills-sub-title">Your Skills ({profile.skills?.length || 0})</h3>
                <div className="skills-grid">
                  {profile.skills?.map(skill => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
              {editing && (
                <div className="skills-section">
                  <h3 className="skills-sub-title">Add More Skills</h3>
                  <div className="all-skills-grid">
                    {mockSkills.map(skill => {
                      const selected = draft.skills?.find(s => s.id === skill.id)
                      return (
                        <button
                          key={skill.id}
                          className={`skill-toggle ${selected ? 'selected' : ''}`}
                          onClick={() => toggleSkill(skill)}
                          style={{ '--skill-color': skill.color } as React.CSSProperties}
                        >
                          <span className="skill-dot-btn" />
                          {skill.name}
                          {selected && <Check size={12} />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
