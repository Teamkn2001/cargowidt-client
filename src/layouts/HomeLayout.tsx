import { Link, Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="min-h-screen  flex flex-col">
      <header className="flex justify-center gap-12">
        <Link to="/">Home</Link>
        <Link to="/about">about</Link>
        <Link to="/reference">Reference</Link>
      </header>
      <Outlet />
      <footer className="flex justify-center"> 
        <h1>Contact</h1>
        <p>email : sudtipong.fullstack@gmail.com</p>
      </footer>
    </div>
  );
}
