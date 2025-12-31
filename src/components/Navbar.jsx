import { NavLink, useNavigate } from "react-router-dom";
import { Home, Info, LayoutDashboard, PlusCircle, Users } from "lucide-react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    // Clear stored ride data
    localStorage.removeItem("rideRoute");

    await auth.signOut();
    navigate("/login");
  };


  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-indigo-600 h-[64px] flex items-center px-8 shadow-md">

      {/* LOGO */}
      <div
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img src={logo} alt="HopInHub" className="w-9 h-9" />
        <h1 className="text-white font-bold text-xl">HopInHub</h1>
      </div>

      {/* NAV LINKS */}
      <div className="mx-auto flex gap-8 text-white font-medium">
        <NavItem to="/home" icon={<Home size={18} />} label="Home" />
        <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem to="/create-ride" icon={<PlusCircle size={18} />} label="Create Ride" />
        <NavItem to="/join-ride" icon={<Users size={18} />} label="Join Ride" />
        <NavItem to="/about" icon={<Info size={18} />} label="About" />
      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
      >
        Logout
      </button>
    </nav>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200
        ${
          isActive
            ? "text-yellow-300 border-b-2 border-yellow-300"
            : "text-white hover:text-yellow-200"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
