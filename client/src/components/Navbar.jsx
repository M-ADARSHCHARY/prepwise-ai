import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutThunk } from '../redux/auth/authSlice';

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'New Session', to: '/session' },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await dispatch(logoutThunk()).unwrap();
    } finally {
      localStorage.removeItem('prepwise_active_session_id');
      setLoggingOut(false);
      setMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-xl text-zinc-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-[#111114] shadow-inner shadow-black/20">
            <span className="text-sm font-bold tracking-tight text-zinc-100">PW</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-100">PrepWise AI</p>
            <p className="truncate text-xs text-zinc-500">Personal interview prep</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'border-zinc-700 bg-zinc-100 text-zinc-950'
                    : 'border-zinc-800 bg-[#111114] text-zinc-300 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Signed in as</p>
            <p className="max-w-40 truncate text-sm font-medium text-zinc-200">
              {user?.name || user?.email || 'User'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loggingOut ? 'Logging out' : 'Logout'}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-[#111114] text-zinc-100 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-800/80 bg-[#09090b] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? 'border-zinc-700 bg-zinc-100 text-zinc-950'
                      : 'border-zinc-800 bg-[#111114] text-zinc-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;