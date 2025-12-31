import { auth } from "../firebase";

const API_BASE = "http://localhost:5000/api";

export async function fetchRides() {
  const res = await fetch(`${API_BASE}/rides`);
  if (!res.ok) throw new Error("Failed to fetch rides");
  return res.json();
}

export async function createRide(pickup, destination, price) {
  const res = await fetch(`${API_BASE}/rides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pickup, destination, price }),
  });

  if (!res.ok) throw new Error("Failed to create ride");
  return res.json();
}
export const bookRide = async (rideId, userEmail) => {
  const token = await auth.currentUser.getIdToken(); // 🔥 REQUIRED

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ HERE
      },
      body: JSON.stringify({ rideId, userEmail }),
    }
  );

  return res.json();
};
