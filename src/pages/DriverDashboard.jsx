import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { authFetch } from "../services/authFetch";

export default function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState("");
  
    const createRide = async () => {
        if (!pickup || !destination || !price) {
            alert("Fill all fields");
            return;
        }

        try {
            await authFetch("http://localhost:5000/api/rides", {
            method: "POST",
            body: JSON.stringify({
                pickup,
                destination,
                price,
                driverId: auth.currentUser.uid, // backend can also read this from token
            }),
            });

            alert("Ride created successfully 🚗");
            setPickup("");
            setDestination("");
            setPrice("");
        } catch (err) {
            console.error("Failed to create ride", err);
            alert("Ride creation failed");
        }
    };


  const fetchBookings = async () => {
        try {
            const driverId = auth.currentUser.uid;

            const res = await authFetch("http://localhost:5000/api/bookings");

            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.error("Failed to load bookings", err);
        } finally {
            setLoading(false);
        }
    };


  const updateStatus = async (id, action) => {
  try {
    await authFetch(
      `http://localhost:5000/api/bookings/${id}/${action}`,
      { method: "PATCH" }
    );

    fetchBookings(); // refresh list
  } catch (err) {
    console.error("Failed to update booking status", err);
  }
};


  useEffect(() => {
    if (!auth.currentUser) return;
    fetchBookings();
  }, []);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "driver") {
      navigate("/select-role");
    }
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          🚗 Driver Dashboard
        </h1>

        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Create a Ride</h2>

            <input
                placeholder="Pickup Location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
            />

            <input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
            />

            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
            />

            <button
                onClick={createRide}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Create Ride
            </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No booking requests yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white shadow-xl rounded-xl p-6 border"
              >
                <p className="font-semibold text-lg">
                  {b.ride.pickup} → {b.ride.destination}
                </p>

                <p className="text-gray-600 text-sm mt-1">
                  Requested by: <b>{b.userEmail}</b>
                </p>

                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      b.status === "pending"
                        ? "text-yellow-600"
                        : b.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>

                {b.status === "pending" && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => updateStatus(b._id, "approve")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(b._id, "reject")}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
