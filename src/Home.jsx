import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import heroImg from "../assets/hero.jpg"; // use your image

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!pickup || !destination) {
      alert("Please enter pickup and destination");
      return;
    }

    navigate(`/dashboard?pickup=${pickup}&destination=${destination}`);
  };

  return (
    <div className="pt-[64px] min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <div
        className="relative -mt-4 text-white overflow-hidden"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center text-white max-w-3xl px-6">
          <h1 className="text-5xl font-bold mb-4">
            Smart Commute Starts Here
          </h1>
          <p className="text-lg mb-10">
            Reliable rides. Affordable carpools. Fast daily commute solutions.
          </p>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl mx-auto text-gray-800">
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border"
            />

            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg border"
            />

            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Find Rides
            </button>
          </div>
        </div>
      </div>

      {/* CHOOSE RIDE */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Choose Your Ride</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-10">
          {[
            { title: "Carpool", desc: "Share a ride & save 50%" },
            { title: "Bike Ride", desc: "Fast & affordable" },
            { title: "Share Commute", desc: "Office commute sharing" },
            { title: "Auto", desc: "Quick & convenient" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition"
            >
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY HOPINHUB */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-12">Why HopInHub?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-4xl mb-3">💸</div>
            <h3 className="font-semibold">Affordable Rides</h3>
            <p className="text-gray-600">
              Save up to 60% using shared carpools.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-semibold">Eco-friendly</h3>
            <p className="text-gray-600">
              Reduce CO₂ emissions with shared travel.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold">Fast & Reliable</h3>
            <p className="text-gray-600">
              Verified users and quick ride matching.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-10">
        <p>© 2025 HopInHub · Smart commute. Better city.</p>
      </footer>
    </div>
  );
}
