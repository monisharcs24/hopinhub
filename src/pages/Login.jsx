import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.png";
import logo from "../assets/logo.png";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { requestNotificationPermission } from "../notifications";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      localStorage.removeItem("rideRoute");
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const saveToken = async () => {
    const token = await requestNotificationPermission();
    if (!token) return;

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      fcmToken: token,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="HopInHub" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-blue-600">HopInHub</h1>
        </div>

      </nav>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row items-center justify-between px-16 mt-10 gap-10">

        {/* LEFT CONTENT */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight whitespace-nowrap">
            Smart Commute Starts Here
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Reliable rides. Affordable carpools. Fast daily commute solutions.
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGoogleLogin}
              className="bg-blue-600 text-white px-7 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Sign in with Google
            </button>

            <button
              onClick={() => navigate("/learn-more")}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="max-w-xl relative -ml-10">
          <img
            src={heroImg}
            alt="Car illustration"
            className="w-[520px]"
          />
        </div>
      </div>
    </div>
  );
}
