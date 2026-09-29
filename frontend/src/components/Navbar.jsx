import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, UtensilsCrossed, Settings, Heart, LogOut, ChevronDown, MessageCircleQuestion, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useKitchen } from '../context/KitchenContext';

export default function Navbar({ onOpenSnap, onOpenSettings, onOpenAskAi, savedCount = 0 }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { clearRecipes } = useKitchen();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close account menu on outside click / Escape / route change
  useEffect(() => {
    const onDocClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setUserOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    setUserOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearRecipes?.();
    logout();
    setUserOpen(false);
    navigate('/', { replace: true });
  };

  const initial = (user?.name?.trim()?.[0] || 'C').toUpperCase();

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <Link
        to="/"
        className="nav-brand"
        style={{ textDecoration: 'none' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="brand-icon">
          <UtensilsCrossed size={22} strokeWidth={2.4} />
        </div>
        <div className="brand-title">
          Fridge <em>to</em> Table
        </div>
      </Link>

      <button
        type="button"
        className="nav-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/cutting-board" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            The Cutting Board
          </NavLink>
        </li>
        <li>
          <NavLink to="/saved" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Saved
            {savedCount > 0 && <span className="nav-count-pill">{savedCount}</span>}
          </NavLink>
        </li>
        <li>
          <button type="button" className="nav-link nav-ask-ai" onClick={() => { setMenuOpen(false); onOpenAskAi(); }} title="Ask the AI Chef anything">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <MessageCircleQuestion size={15} />
              Ask AI
            </span>
          </button>
        </li>
        {!isAuthenticated && (
          <li className="nav-mobile-auth">
            <Link to="/login" className="btn-sign-in" style={{ textDecoration: 'none' }}>
              Log in
            </Link>
            <Link to="/register" className="btn-get-started" style={{ textDecoration: 'none' }}>
              <Sparkles size={16} /> Sign up
            </Link>
          </li>
        )}
        <li className="nav-mobile-auth">
          <button type="button" className="btn-sign-in" onClick={() => { setMenuOpen(false); onOpenSettings(); }}>
            System status
          </button>
        </li>
      </ul>

      <div className="nav-actions">
        {isAuthenticated ? (
          <div className="user-menu-wrap" ref={userMenuRef}>
            <button
              type="button"
              className="user-chip"
              onClick={() => setUserOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userOpen}
              title={user?.email}
            >
              <span className="user-avatar">{initial}</span>
              <span className="user-chip-name">{user?.name?.split(' ')[0] || 'Chef'}</span>
              <ChevronDown size={15} className={`user-chip-chevron ${userOpen ? 'flipped' : ''}`} />
            </button>

            {userOpen && (
              <div className="user-menu" role="menu">
                <div className="user-menu-header">
                  <span className="user-avatar large">{initial}</span>
                  <div className="user-menu-identity">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>
                <Link to="/saved" className="user-menu-item" role="menuitem">
                  <Heart size={16} />
                  My Saved Recipes
                  {savedCount > 0 && <span className="nav-count-pill">{savedCount}</span>}
                </Link>
                <button
                  type="button"
                  className="user-menu-item"
                  role="menuitem"
                  onClick={() => { setUserOpen(false); onOpenAskAi(); }}
                >
                  <MessageCircleQuestion size={16} />
                  Ask AI Chef
                </button>
                <button
                  type="button"
                  className="user-menu-item"
                  role="menuitem"
                  onClick={() => { setUserOpen(false); onOpenSettings(); }}
                >
                  <Settings size={16} />
                  System & Diagnostics
                </button>
                <div className="user-menu-divider" />
                <button
                  type="button"
                  className="user-menu-item danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-sign-in nav-desktop-only" style={{ textDecoration: 'none' }}>
            Log in
          </Link>
        )}

        <button type="button" className="btn-get-started nav-snap-btn" onClick={onOpenSnap}>
          <Sparkles size={16} /> <span className="btn-label">Snap Fridge</span>
        </button>
      </div>
    </nav>
  );
}
