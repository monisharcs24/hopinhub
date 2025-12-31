import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import RideChat from "./RideChat";

export default function FloatingChat({ rideId, onClose }) {
  if (!rideId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed bottom-6 right-6 w-[360px] h-[480px] bg-white rounded-xl shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} />
            <span className="font-semibold">Ride Chat</span>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto">
          <RideChat rideId={rideId} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
