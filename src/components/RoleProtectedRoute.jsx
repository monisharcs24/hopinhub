import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function RoleProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().role === role) {
        setAllowed(true);
      }

      setLoading(false);
    };

    checkRole();
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
