import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function RideChat({ rideId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!rideId) return;

    const q = query(
      collection(db, "rides", rideId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsub();
  }, [rideId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "rides", rideId, "messages"), {
      text,
      senderId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

    const completeRide = async () => {
    await updateDoc(doc(db, "rides", activeRideId), {
        status: "completed"
    });

    localStorage.removeItem("activeRideId");
    setActiveRideId(null);
    };


  return (
    <div className="bg-white rounded-xl p-4 shadow mt-6">
      <h3 className="font-semibold mb-3">Ride Chat</h3>

      <div className="h-52 overflow-y-auto border p-2 rounded mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.senderId === auth.currentUser.uid
                ? "text-right"
                : "text-left"
            }`}
          >
            <span className="inline-block px-3 py-1 rounded bg-gray-200">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
