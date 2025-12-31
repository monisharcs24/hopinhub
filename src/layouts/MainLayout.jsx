import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="pt-20"> {/* space below navbar */}
        <Outlet />
      </div>
    </>
  );
}
