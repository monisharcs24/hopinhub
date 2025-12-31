import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import RideChat from "../components/RideChat";

export default function CreateRide() {
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [myRides, setMyRides] = useState([]);
  const [activeRideId, setActiveRideId] = useState(
    localStorage.getItem("activeRideId")
  );

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!auth.currentUser) navigate("/login");
  }, []);

  /* ================= CREATE RIDE ================= */
  const handleCreateRide = async () => {
    if (!pickup || !destination || !vehicleType || !seats || !price || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "rides"), {
      pickup,
      destination,
      vehicleType,
      seats: Number(seats),
      availableSeats: Number(seats),
      price: Number(price),
      date,
      time,
      createdBy: auth.currentUser.uid,
      passengers: [],
      status: "open",
      createdAt: serverTimestamp(),
    });

    setPickup("");
    setDestination("");
    setVehicleType("");
    setSeats("");
    setPrice("");
    setDate("");
    setTime("");

    alert("Ride created successfully 🚗");
  };

  /* ================= FETCH MY RIDES ================= */
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "rides"),
      where("createdBy", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMyRides(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  /* ================= COMPLETE RIDE ================= */
  const completeRide = async (rideId) => {
    await updateDoc(doc(db, "rides", rideId), {
      status: "completed",
    });

    if (activeRideId === rideId) {
      setActiveRideId(null);
      localStorage.removeItem("activeRideId");
    }
  };

  /* ================= CANCEL RIDE ================= */
  const cancelRide = async (rideId) => {
    await updateDoc(doc(db, "rides", rideId), {
      status: "cancelled",
    });

    if (activeRideId === rideId) {
      setActiveRideId(null);
      localStorage.removeItem("activeRideId");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-20 px-6">

        {/* ================= CREATE FORM ================= */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create a Ride
          </h2>

          <input
            placeholder="Pickup Location"
            className="w-full border p-3 rounded mb-4"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />

          <input
            placeholder="Destination"
            className="w-full border p-3 rounded mb-4"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <select
            className="w-full border p-3 rounded mb-4"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">Select Vehicle</option>
            <option value="Car">Car</option>
            <option value="Auto">Auto</option>
          </select>

          <input
            type="number"
            placeholder="Seats"
            className="w-full border p-3 rounded mb-4"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price (₹)"
            className="w-full border p-3 rounded mb-4"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-3 rounded mb-4"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border p-3 rounded mb-6"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button
            onClick={handleCreateRide}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Create Ride
          </button>
        </div>

        {/* ================= ACTIVE RIDES ================= */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">Active Rides</h2>

        {myRides.filter(r => r.status === "open").length === 0 ? (
          <p className="text-gray-500">No active rides.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {myRides.filter(r => r.status === "open").map((ride) => (
              <div key={ride.id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold">
                  {ride.pickup} → {ride.destination}
                </h3>

                <p>Seats Left: {ride.availableSeats}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setActiveRideId(ride.id);
                      localStorage.setItem("activeRideId", ride.id);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Open Chat
                  </button>

                  <button
                    onClick={() => completeRide(ride.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => cancelRide(ride.id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= RIDE HISTORY ================= */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Ride History
        </h2>

        {myRides.filter(r => r.status !== "open").length === 0 ? (
          <p className="text-gray-500">No past rides.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {myRides
              .filter(r => r.status !== "open")
              .map((ride) => (
                <div key={ride.id} className="bg-gray-100 p-6 rounded-xl">
                  <h3 className="font-semibold">
                    {ride.pickup} → {ride.destination}
                  </h3>

                  <p>Status: {ride.status}</p>
                  <p>Seats Used: {ride.seats - ride.availableSeats}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* CHAT */}
      {activeRideId && (
        <RideChat
          rideId={activeRideId}
          onClose={() => {
            setActiveRideId(null);
            localStorage.removeItem("activeRideId");
          }}
        />
      )}
    </div>
  );
}
