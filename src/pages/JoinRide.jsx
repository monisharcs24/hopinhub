import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import RideChat from "../components/RideChat";

/* ---------------- HELPERS ---------------- */
const formatDate = (date) => {
  if (!date) return "N/A";
  if (date.seconds) return new Date(date.seconds * 1000).toLocaleDateString();
  return date;
};

const formatTime = (time) => {
  if (!time) return "N/A";
  if (time.seconds)
    return new Date(time.seconds * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  return time;
};

export default function JoinRide() {
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  const [rides, setRides] = useState([]);
  const [destinationFilter, setDestinationFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [seatSelection, setSeatSelection] = useState({});
  const [activeRideId, setActiveRideId] = useState(
    localStorage.getItem("activeRideId")
  );

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    if (!auth.currentUser) navigate("/login");
  }, []);

  /* ---------------- FETCH RIDES ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rides"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRides(list);
    });

    return () => unsub();
  }, []);

  /* ---------------- JOIN RIDE ---------------- */
  const joinRide = async (ride) => {
    const seats = Number(seatSelection[ride.id] || 1);

    if (seats > ride.availableSeats) {
      alert("Not enough seats available");
      return;
    }

    const updatedPassengers = {
      ...(ride.passengers || {}),
      [uid]: seats,
    };

    await updateDoc(doc(db, "rides", ride.id), {
      passengers: updatedPassengers,
      availableSeats: ride.availableSeats - seats,
    });

    setActiveRideId(ride.id);
    localStorage.setItem("activeRideId", ride.id);
  };

  /* ---------------- CANCEL RIDE ---------------- */
  const cancelRide = async (ride) => {
    const userSeats = ride.passengers?.[uid] || 0;

    const updatedPassengers = { ...ride.passengers };
    delete updatedPassengers[uid];

    await updateDoc(doc(db, "rides", ride.id), {
      passengers: updatedPassengers,
      availableSeats: ride.availableSeats + userSeats,
    });

    setActiveRideId(null);
    localStorage.removeItem("activeRideId");
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const availableRides = rides.filter((r) =>
    r.status !== "completed" &&
    r.availableSeats > 0 &&
    r.createdBy !== uid &&
    !r.passengers?.[uid] &&
    (!destinationFilter ||
      r.destination?.toLowerCase().includes(destinationFilter.toLowerCase()))
  );

  const joinedRides = rides.filter(
    (r) => r.passengers?.[uid] && r.status !== "completed"
  );

  if (sortBy === "price") {
    availableRides.sort((a, b) => (a.price || 0) - (b.price || 0));
  }

  if (sortBy === "time") {
    availableRides.sort(
      (a, b) => (a.time?.seconds || 0) - (b.time?.seconds || 0)
    );
  }

  return (
    <motion.div className="min-h-screen bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-blue-600 text-center">
          🚗 Join a Ride
        </h1>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <input
            className="border p-3 rounded w-64"
            placeholder="Search destination"
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="time">Time</option>
            <option value="price">Price</option>
          </select>
        </div>

        {/* AVAILABLE RIDES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {availableRides.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No rides available
            </p>
          )}

          {availableRides.map((ride) => (
            <div key={ride.id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold">{ride.vehicleType}</h3>
              <p>{ride.pickup} → {ride.destination}</p>
              <p className="text-sm">
                📅 {formatDate(ride.date)} | 🕒 {formatTime(ride.time)}
              </p>

              <p>💰 ₹{ride.price}</p>
              <p>👥 Seats Left: {ride.availableSeats}</p>

              <select
                className="mt-2 border p-2 rounded w-full"
                onChange={(e) =>
                  setSeatSelection({
                    ...seatSelection,
                    [ride.id]: e.target.value,
                  })
                }
              >
                {[...Array(ride.availableSeats)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} seat(s)
                  </option>
                ))}
              </select>

              <button
                onClick={() => joinRide(ride)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
              >
                Join Ride
              </button>
            </div>
          ))}
        </div>

        {/* JOINED RIDES */}
        <h2 className="text-2xl font-semibold mt-14 mb-4 text-center">
          Your Joined Rides
        </h2>

        {joinedRides.length === 0 ? (
          <p className="text-center text-gray-500">No joined rides</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {joinedRides.map((ride) => (
              <div key={ride.id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold">
                  {ride.pickup} → {ride.destination}
                </h3>

                <p className="text-sm">
                  {formatDate(ride.date)} | {formatTime(ride.time)}
                </p>

                <p>
                  You booked:{" "}
                  <strong>{ride.passengers[uid]}</strong>
                </p>

                <p>Seats left: {ride.availableSeats}</p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setActiveRideId(ride.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Open Chat
                  </button>

                  <button
                    onClick={() => cancelRide(ride)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel Ride
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeRideId && (
        <RideChat
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
