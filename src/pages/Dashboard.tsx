import { Link } from 'react-router-dom'
import { Compass, Heart, Users, TrendingUp, Zap, Code as Code2, ArrowRight, GitBranch, Clock } from 'lucide-react'
import { ProfileCard } from '../components/ProfileCard'
import { SkillBadge } from '../components/SkillBadge'
import { mockProfiles, mockMatches, mockProjects, myProfile } from '../data/mockProfiles'
import '../styles/Dashboard.css'

const stats = [
  { label: 'Profile Views', value: '142', change: '+12%', icon: TrendingUp, color: '#3b82f6' },
  { label: 'Total Matches', value: '23', change: '+3 this week', icon: Heart, color: '#ef4444' },
  { label: 'Connections', value: '8', change: 'Active chats', icon: Users, color: '#22c55e' },
  { label: 'Swipes Today', value: '18', change: 'of 50 daily', icon: Zap, color: '#f59e0b' },
]

const activities = [
  { id: 1, type: 'match', user: 'Sarah Chen', time: '30 min ago', avatar: mockProfiles[0].avatar_url },
  { id: 2, type: 'view', user: 'Marcus Rivera', time: '2 hrs ago', avatar: mockProfiles[1].avatar_url },
  { id: 3, type: 'match', user: 'Jordan Kim', time: '5 hrs ago', avatar: mockProfiles[3].avatar_url },
  { id: 4, type: 'view', user: 'Aiko Tanaka', time: '1 day ago', avatar: mockProfiles[2].avatar_url },
]

const projectStatusColor: Record<string, string> = {
  idea: '#f59e0b',
  in_progress: '#3b82f6',
  completed: '#22c55e',
}

const projectStatusLabel: Record<string, string> = {
  idea: 'Idea',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Good morning, {myProfile.name.split(' ')[0]}</h1>
          <p className="dashboard-subtitle">Here's what's happening with your DevMatch today</p>
        </div>
        <Link to="/explore" className="btn-primary">
          <Compass size={16} />
          Start Exploring
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ '--stat-color': stat.color } as React.CSSProperties}>
              <stat.icon size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-col-main">
          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Compass size={18} />
                Suggested Developers
              </h2>
              <Link to="/explore" className="see-all">
                See All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="suggested-list">
              {mockProfiles.slice(0, 3).map((profile) => (
                <ProfileCard key={profile.id} profile={profile} compact />
              ))}
            </div>
          </section>

          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <GitBranch size={18} />
                Active Projects
              </h2>
              <button className="see-all">
                Add Project <ArrowRight size={14} />
              </button>
            </div>
            <div className="projects-list">
              {mockProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-card-header">
                    <h3 className="project-title">{project.title}</h3>
                    <span
                      className="project-status"
                      style={{ '--status-color': projectStatusColor[project.status] } as React.CSSProperties}
                    >
                      {projectStatusLabel[project.status]}
                    </span>
                  </div>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tech">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="project-footer">
                    <span className="project-team">
                      <Users size={13} />
                      {project.team_size} members
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-col-side">
          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Users size={18} />
                Your Profile
              </h2>
              <Link to="/profile" className="see-all">
                Edit <ArrowRight size={14} />
              </Link>
            </div>
            <div className="my-profile-card">
              <img src={myProfile.avatar_url} alt={myProfile.name} className="my-avatar" />
              <div className="my-profile-info">
                <h3 className="my-name">{myProfile.name}</h3>
                <p className="my-bio">{myProfile.bio}</p>
                <div className="my-skills">
                  {myProfile.skills?.map((skill) => (
                    <SkillBadge key={skill.id} skill={skill} size="sm" />
                  ))}
                </div>
                <div className="profile-completion">
                  <div className="completion-header">
                    <span>Profile Completion</span>
                    <span className="completion-pct">80%</span>
                  </div>
                  <div className="completion-bar">
                    <div className="completion-fill" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Heart size={18} />
                Recent Matches
              </h2>
              <Link to="/matches" className="see-all">
                All Matches <ArrowRight size={14} />
              </Link>
            </div>
            <div className="matches-list">
              {mockMatches.map((match) => (
                <div key={match.id} className="match-item">
                  <img src={match.profile.avatar_url} alt={match.profile.name} className="match-avatar" />
                  <div className="match-info">
                    <span className="match-name">{match.profile.name}</span>
                    <span className="match-skills">
                      {match.profile.skills?.slice(0, 2).map(s => s.name).join(', ')}
                    </span>
                  </div>
                  <button className="match-chat-btn">Chat</button>
                </div>
              ))}
            </div>
          </section>

          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Clock size={18} />
                Recent Activity
              </h2>
            </div>
            <div className="activity-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-avatar-wrap">
                    <img src={activity.avatar} alt={activity.user} className="activity-avatar" />
                    <span className={`activity-icon ${activity.type}`}>
                      {activity.type === 'match' ? <Heart size={10} fill="white" /> : <Code2 size={10} />}
                    </span>
                  </div>
                  <div className="activity-info">
                    <span className="activity-text">
                      <strong>{activity.user}</strong>{' '}
                      {activity.type === 'match' ? 'matched with you' : 'viewed your profile'}
                    </span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
