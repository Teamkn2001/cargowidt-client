import  { useState } from 'react';
import { Menu } from "lucide-react";
import ClerkAuth from '../auth/ClerkAuth';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className=" fixed top-0 left-0 w-full z-50 ">
    {/* Mobile */}
    <div className="lg:hidden">
      <div className="h-14 bg-primary z-50 pr-4 flex justify-between items-center w-full absolute top-0">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-4 text-white"
          aria-label="Toggle menu"
        >
          <Menu
            className={`transform transition-transform duration-200 ${
              isMenuOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>
        <ClerkAuth />
      </div>

      <nav
        className={`fixed w-full mt-14  bg-secondary z-30 flex flex-col items-center gap-4 py-4 transform transition-all duration-300 ease-in-out text-white
      ${
        isMenuOpen
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }
    `}
        aria-hidden={!isMenuOpen}
      >
        <Link to="/" className="transition-colors hover:text-blue-100">
          Home
        </Link>
        <Link to="/about" className="transition-colors hover:text-blue-100">
          About
        </Link>
        <Link
          to="/reference"
          className="transition-colors hover:text-blue-100"
        >
          Reference
        </Link>
      </nav>
      {/* Optional: Backdrop overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>

    {/* Desktop */}
    <nav className="hidden lg:flex justify-center items-center gap-12 p-4 h-18 bg-primary text-white">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/reference">Reference</Link>
      <ClerkAuth />
    </nav>
  </header>
  );
}