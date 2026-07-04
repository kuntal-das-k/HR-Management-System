import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPhoneLine } from 'react-icons/ri';
import logo from '../../assets/logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Solutions', path: '/solutions' },
  { name: 'Resources', path: '/resources' },
  { name: 'About Us', path: '/about' },
  { name: 'Pricing', path: '/pricing' }
];

const PublicNavbar = () => {
  const location = useLocation();

  return (
    <nav className="w-full pt-6 pb-4 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8 z-50 relative">
      {/* Logo */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logo} alt="HRMS Logo" className="h-12 w-auto" />
          <span className="font-bold text-xl leading-none text-gray-900 tracking-tight">HRmanager</span>
        </Link>
      </div>

      {/* Links with Glassmorphism Active State */}
      <div className="hidden lg:flex items-center justify-center p-1.5 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm shrink-0">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-[#F4EBE0]/90 to-[#E8D5BC]/90 backdrop-blur-md rounded-full shadow-sm border border-[#B58A59]/30"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Right CTA */}
      <div className="flex items-center justify-end gap-4 flex-1">
        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white shadow-sm">
          <RiPhoneLine className="text-gray-700" />
        </button>
        <Link to="/register" className="px-6 py-2.5 rounded-full bg-[#1D1D1D] text-white text-sm font-semibold hover:bg-black transition-colors shadow-sm whitespace-nowrap">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
