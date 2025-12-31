import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Search, Car, Bike, Users } from "lucide-react";
import bannerImage from "../assets/hopin-banner.png";
import Navbar from "../components/Navbar";
import LocationAutocomplete from "../components/LocationAutocomplete";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    if (!pickup || !destination) {
      alert("Enter both pickup and destination!");
      return;
    }

    navigate("/dashboard", {
      state: {
        pickup,
        destination,
      },
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );

          const data = await res.json();

          if (data.status === "OK") {
            const address = data.results[0].formatted_address;
            setPickup(address);
          } else {
            alert("Unable to fetch address");
          }
        } catch (error) {
          console.error(error);
          alert("Error detecting location");
        }
      },
      () => alert("Location permission denied")
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  {/* HERO SECTION */}
  <section className="relative text-white px-6 overflow-hidden">

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="
        relative 
        flex flex-col 
        justify-center 
        items-center 
        h-[60vh]     /* Shorter hero */
        bg-cover 
        bg-center 
        bg-no-repeat 
        text-white
      "
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundAttachment: "fixed", /* Parallax effect */
      }}
    >
      {/* Dark vignette edges */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Soft blur edges */}
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>

      {/* Top gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>

      {/* Bottom fade for search bar visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl font-extrabold drop-shadow-2xl">
          Smart Commute Starts Here
        </h1>

        <p className="mt-4 text-lg drop-shadow-md">
          Reliable rides. Affordable carpools. Fast daily commute solutions.
        </p>
      </div>
    </motion.div>

  </section>




      {/* SEARCH CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-[90%] md:w-[55%] lg:w-[45%] mx-auto -mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <form onSubmit={submitForm} className="flex flex-col gap-6">

          {/* Pickup Field */}
          <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-2xl">
            <MapPin className="text-indigo-600" />
            <LocationAutocomplete
              value={pickup}
              onChange={setPickup}
              placeholder="Pickup Location"
            />
          </div>


          {/* Detect Button */}
          <button
            type="button"
            onClick={detectLocation}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition"
          >
            <Navigation size={18} /> Detect Location
          </button>


          {/* Destination Field */}
          <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-2xl">
            <Search className="text-indigo-600" />
            <LocationAutocomplete
              value={destination}
              onChange={setDestination}
              placeholder="Destination"
            />
          </div>


          {/* Find Ride Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 rounded-xl text-lg hover:opacity-90 transition font-semibold"
          >
            Find Rides
          </button>
        </form>
      </motion.div>

      {/* CATEGORY SLIDER (Choose Your Ride) */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Choose Your Ride</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Carpool", desc: "Share a ride & save 50%", icon: "/icons/car.svg" },
            { title: "Bike Ride", desc: "Fast & affordable", icon: "/icons/bike.svg" },
            { title: "Share Commute", desc: "Office commute sharing", icon: "/icons/share.svg" },
            { title: "Auto", desc: "Quick & convenient", icon: "/icons/auto.svg" },
          ].map((ride, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center hover:shadow-lg transition-colors duration-300 cursor-pointer"
            >
              <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img src={ride.icon} alt={ride.title} className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{ride.title}</h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">{ride.desc}</p>
            </div>
          ))}
        </div>
      </div>



      {/* FEATURES */}
      <section className="px-6 mt-24">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">
          Why HopInHub?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {[
            {
              title: "Affordable Rides",
              desc: "Save up to 60% using shared carpool options.",
              emoji: "💸",
            },
            {
              title: "Eco-friendly",
              desc: "Reduce CO₂ emissions with shared travel.",
              emoji: "🌍",
            },
            {
              title: "Fast & Reliable",
              desc: "Verified users and instant ride matching.",
              emoji: "⚡",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center"
            >
              <div className="text-5xl">{f.emoji}</div>
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 bg-gray-900 text-gray-300 py-12 px-6 text-center">
        <h3 className="text-xl font-semibold text-white">HopInHub © 2025</h3>
        <p className="mt-2 opacity-60">Smart commute. Better city.</p>
      </footer>
    </div>
    
  );
}
