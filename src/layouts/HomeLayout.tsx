import { Link, Outlet } from "react-router-dom";
import ClerkAuth from "../components/auth/ClerkAuth";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function HomeLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col ">
      <header className="bg-red-400 fixed top-0 left-0 w-full z-10 ">
        {/* Mobile */}
        <div className="lg:hidden flex justify-between mr-4 h-14">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-4">
            <Menu className={`${isMenuOpen ? "rotate-90 duration-200" : "rotate-0 duration-200"}`}/>
          </button>
          {isMenuOpen && (
            <nav className="flex flex-col items-center w-full fixed top-14  gap-4 py-4 bg-blue-400">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/reference">Reference</Link>
            </nav>
          )}
           <ClerkAuth />
        </div>
        
        {/* Desktop */}
        <nav className="hidden lg:flex justify-center gap-12 p-4 h-18">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/reference">Reference</Link>
          <ClerkAuth />
        </nav>
      </header>
      <Outlet />
      <footer className="flex justify-center">
        <h1>Contact</h1>
        <p>email: sudtipong.fullstack@gmail.com</p>
      </footer>
    </div>
  );
}