import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BLEUWZJ5yujv__Q3sPF5MsZ4_bo72Qu-ocerIjF_TV2tuCQJhqmdMKc-2dE0Hy3FLnUmVpXbzp6am5Dx7k-WyrU",
    });

    return token;
  }
};
