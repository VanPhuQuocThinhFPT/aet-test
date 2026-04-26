import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Compass, Heart, User, Code as Code2 } from 'lucide-react'
import '../styles/Navbar.css'

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Code2 size={22} strokeWidth={2.5} />
        <span className="brand-name">DevMatch</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Compass size={18} />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/matches" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Heart size={18} />
          <span>Matches</span>
          <span className="badge">3</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  )
}
