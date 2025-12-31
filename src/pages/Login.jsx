import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.png";
import logo from "../assets/logo.png";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { requestNotificationPermission } from "../notifications";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save user info
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true }
      );

      // ✅ Request push notifications
      try {
        const token = await requestNotificationPermission();
        if (token) {
          await setDoc(
            doc(db, "users", user.uid),
            { fcmToken: token },
            { merge: true }
          );
        }
      } catch (err) {
        console.warn("Notification permission denied");
      }

      // Clear cached route
      localStorage.removeItem("rideRoute");

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="HopInHub" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-blue-600">HopInHub</h1>
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center justify-between px-16 mt-10 gap-10">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold text-gray-900">
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

        <div className="max-w-xl relative -ml-10">
          <img src={heroImg} alt="Car illustration" className="w-[520px]" />
        </div>
      </div>
    </div>
  );
}
