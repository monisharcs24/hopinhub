import { useState } from "react";
import { MapPin, Navigation, Car, Users, IndianRupee, Calendar, Clock } from "lucide-react";

export default function CreateRide() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-start py-10 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white text-center">
          <h2 className="text-xl font-semibold">Create a Ride</h2>
          <p className="text-sm opacity-90">Plan your journey easily</p>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4">

          {/* Pickup */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <MapPin className="text-blue-600 mr-2" size={18} />
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* Destination */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Navigation className="text-blue-600 mr-2" size={18} />
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* Vehicle */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Car className="text-blue-600 mr-2" size={18} />
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full outline-none bg-transparent"
            >
              <option value="">Select Vehicle</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Auto">Auto</option>
            </select>
          </div>

          {/* Seats */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Users className="text-blue-600 mr-2" size={18} />
            <input
              type="number"
              placeholder="Seats"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* Price */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <IndianRupee className="text-blue-600 mr-2" size={18} />
            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* Date */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Calendar className="text-blue-600 mr-2" size={18} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* Time */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Clock className="text-blue-600 mr-2" size={18} />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Create Ride
          </button>
        </form>

        {/* Info Section */}
        <div className="px-6 pb-6">
          <div className="mt-4">
            <h3 className="font-semibold">Active Rides</h3>
            <p className="text-gray-500 text-sm">No active rides.</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Ride History</h3>
            <p className="text-gray-500 text-sm">No past rides.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
