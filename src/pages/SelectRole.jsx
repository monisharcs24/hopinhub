import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SelectRole() {
  const navigate = useNavigate();

  const handleSelect = async (role) => {
    const user = auth.currentUser;
    if (!user) return;

    // Save role (optional – for analytics / backend)
    await setDoc(
      doc(db, "users", user.uid),
      {
        role,
      },
      { merge: true }
    );

    // 🔥 IMPORTANT: redirect based on role
    if (role === "driver") navigate("/driver");
    else navigate("/home");

  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-10 bg-white">
      <h1 className="text-4xl font-bold">Select Your Role</h1>
      <p className="text-gray-500">Choose how you want to use HopInHub</p>

      <div className="flex gap-10 mt-6">
        {/* CUSTOMER */}
        <div
          onClick={() => handleSelect("customer")}
          className="cursor-pointer w-72 p-8 rounded-2xl shadow-xl hover:scale-105 transition bg-white"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              👤
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center">Customer</h2>
          <p className="text-center text-gray-500 mt-2">
            Book rides & compare prices
          </p>
        </div>

        {/* DRIVER */}
        <div
          onClick={() => handleSelect("driver")}
          className="cursor-pointer w-72 p-8 rounded-2xl shadow-xl hover:scale-105 transition bg-white"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              🚗
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center">Driver</h2>
          <p className="text-center text-gray-500 mt-2">
            Offer rides & earn money
          </p>
        </div>
      </div>
    </div>
  );
}
