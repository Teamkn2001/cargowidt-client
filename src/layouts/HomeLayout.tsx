import { Outlet } from "react-router-dom";
import "animate.css";
import Header from "@/components/homeComponents/Header";

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <Outlet />
    </div>
  );
}
