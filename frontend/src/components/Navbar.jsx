import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutAPI } from "../services/auth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try { await logoutAPI(); } catch {}
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: "⊡" },
    { path: "/tasks", label: "Tasks", icon: "✓" },
    { path: "/profile", label: "Profile", icon: "◎" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#0d0d14]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#1368EC] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#1368EC]/30 group-hover:shadow-[#1368EC]/50 transition-all">
              T
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Task<span className="text-[#1368EC]">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-[#1368EC]/15 text-[#1368EC]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-xs">{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-white/30 text-xs mt-0.5">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1368EC] to-[#0a4bbd] flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-[#1368EC]/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 text-sm transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white/50 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0d0d14] px-4 py-3 space-y-1">
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(path) ? "bg-[#1368EC]/15 text-[#1368EC]" : "text-white/50 hover:text-white"
              }`}
            >
              <span>{icon}</span>{label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;