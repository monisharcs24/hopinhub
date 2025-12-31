import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Users, MessageCircle, Leaf } from "lucide-react";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6"
    >
      <div className="max-w-5xl w-full text-center">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
           About HopInHub
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          HopInHub is a smart carpooling platform designed to make your daily
          commute affordable, eco-friendly, and stress-free.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Feature
            icon={<Car size={28} />}
            title="Smart Ride Matching"
            desc="Find the best rides based on your location and time."
          />

          <Feature
            icon={<Users size={28} />}
            title="Create or Join Carpools"
            desc="Share rides and reduce travel costs effortlessly."
          />

          <Feature
            icon={<MessageCircle size={28} />}
            title="Real-time Chat"
            desc="Communicate instantly with co-passengers."
          />

          <Feature
            icon={<Leaf size={28} />}
            title="Eco-Friendly Travel"
            desc="Reduce traffic and carbon emissions."
          />
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/login")}
          className="px-10 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Get Started 
        </button>
      </div>
    </motion.div>
  );
}

/* Feature Card Component */
function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow hover:shadow-md transition">
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}
