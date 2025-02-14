import { Outlet } from "react-router-dom";
import "animate.css";
import Header from "@/components/homeComponents/Header";

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <Outlet />
      <footer className="flex flex-col justify-center items-center bg-blue-300 h-16">
        <h1 className="font-bold">Contact</h1>
        <p>email: sudtipong.fullstack@gmail.com</p>
      </footer>
    </div>
  );
}
