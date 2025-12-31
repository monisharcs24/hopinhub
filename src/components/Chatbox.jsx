import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function ChatBox({ rideId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!rideId) return;

    const q = query(
      collection(db, "chats", rideId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, [rideId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", rideId, "messages"), {
      senderId: auth.currentUser.uid,
      text,
      timestamp: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <h3 className="font-semibold text-lg mb-2">Chat</h3>

      <div className="h-64 overflow-y-auto border rounded p-2 mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.senderId === auth.currentUser.uid
                ? "text-right"
                : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-lg ${
                msg.senderId === auth.currentUser.uid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
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
