import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import FloatingChat from "../components/FloatingChat";
import MapPreview from "../components/MapPreview";


/* ---------------- PRICE CONFIG ---------------- */
const PRICE_PER_KM = {
  uber: { car: 15, auto: 12, bike: 8 },
  ola: { car: 14, auto: 11, bike: 7 },
  rapido: { bike: 6 },
  indrive: { car: 13, auto: 10 },
};

const PROVIDERS = [
  { name: "Uber", key: "uber", link: "https://m.uber.com" },
  { name: "Ola", key: "ola", link: "https://www.olacabs.com" },
  { name: "Rapido", key: "rapido", link: "https://www.rapido.bike" },
  { name: "InDrive", key: "indrive", link: "https://indrive.com" },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const pickup = location.state?.pickup;
  const destination = location.state?.destination;

  const storedRoute = JSON.parse(localStorage.getItem("rideRoute") || "{}");

  const finalPickup = pickup ?? storedRoute.pickup;
  const finalDestination = destination ?? storedRoute.destination;

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [rides, setRides] = useState([]);
  const [activeRideId, setActiveRideId] = useState(null);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!auth.currentUser) navigate("/login");
  }, []);

  /* ---------------- SAVE ROUTE ---------------- */
  useEffect(() => {
    if (pickup && destination) {
      localStorage.setItem(
        "rideRoute",
        JSON.stringify({ pickup, destination })
      );
    }
  }, [pickup, destination]);

  /* ---------------- GOOGLE DISTANCE CALC ---------------- */
  const calculateDistance = () => {
    if (!window.google || !finalPickup || !finalDestination) return;

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [finalPickup],
        destinations: [finalDestination],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const element = response.rows[0].elements[0];
          setDistance(element.distance.value / 1000); // km
          setDuration(element.duration.text);
        }
      }
    );
  };

  useEffect(() => {
    calculateDistance();
  }, [finalPickup, finalDestination]);

  /* ---------------- FIRESTORE RIDES ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rides"), (snapshot) => {
      setRides(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  /* ---------------- JOIN RIDE ---------------- */
  const joinRide = async (ride) => {
    await updateDoc(doc(db, "rides", ride.id), {
      passengers: arrayUnion(auth.currentUser.uid),
      availableSeats: ride.availableSeats - 1,
    });

    setActiveRideId(ride.id);
    localStorage.setItem("activeRideId", ride.id);
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          🚗 Ride Price Comparison
        </h1>

        {finalPickup && finalDestination && (
          <p className="text-gray-600 mt-2">
            {finalPickup} → {finalDestination}
          </p>
        )}

        {distance && (
          <p className="text-gray-500 mt-1">
            📏 {distance.toFixed(1)} km • ⏱ {duration}
          </p>
        )}

        {finalPickup && finalDestination && (
          <MapPreview
            pickup={finalPickup}
            destination={finalDestination}
          />
        )}


        {/* ---------------- PROVIDERS ---------------- */}
        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {distance &&
            PROVIDERS.map((provider) =>
              Object.entries(PRICE_PER_KM[provider.key] || {}).map(
                ([type, rate]) => (
                  <div
                    key={`${provider.key}-${type}`}
                    className="bg-white p-6 rounded-xl shadow hover:scale-105 transition"
                  >
                    <h3 className="text-xl font-bold">
                      {provider.name} - {type.toUpperCase()}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {distance.toFixed(1)} km
                    </p>

                    <p className="text-lg font-semibold mt-2">
                      ₹ {Math.round(distance * rate)}
                    </p>

                    <button
                      onClick={() => window.open(provider.link, "_blank")}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
                    >
                      Open {provider.name}
                    </button>
                  </div>
                )
              )
            )}
        </div>

        {/* ---------------- COMMUNITY RIDES ---------------- */}
        <h2 className="text-2xl font-bold mt-14 mb-6">Community Rides</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {rides
            .filter(
              (r) =>
                r.pickup === finalPickup &&
                r.destination === finalDestination &&
                r.availableSeats > 0
            )
            .map((ride) => (
              <div
                key={ride.id}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl"
              >
                <h3 className="font-bold">{ride.vehicleType}</h3>
                <p>{ride.pickup} → {ride.destination}</p>
                <p>Seats Left: {ride.availableSeats}</p>

                <button
                  onClick={() => joinRide(ride)}
                  className="mt-4 bg-white text-blue-600 px-4 py-2 rounded"
                >
                  Join Ride
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* CHAT */}
      {activeRideId && (
        <FloatingChat
          rideId={activeRideId}
          onClose={() => {
            setActiveRideId(null);
            localStorage.removeItem("activeRideId");
          }}
        />
      )}
    </motion.div>
  );
}
