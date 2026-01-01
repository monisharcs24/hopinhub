import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";

admin.initializeApp();

export const sendNotification = onDocumentUpdated(
  "rides/{rideId}",
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (!before || !after) return;
    if (before.status === after.status) return;

    const payload = {
      notification: {
        title: "Ride Update",
        body: `Ride is now ${after.status}`,
      },
    };

    if (!after.passengers || after.passengers.length === 0) return;

    const usersSnap = await admin
      .firestore()
      .collection("users")
      .where("uid", "in", after.passengers)
      .get();

    const tokens = usersSnap.docs
      .map((doc) => doc.data().fcmToken)
      .filter(Boolean);

    if (tokens.length > 0) {
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: payload.notification,
      });
    }
  }
);