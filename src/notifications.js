import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (error) {
    console.error("Error getting notification token:", error);
    return null;
  }
};
