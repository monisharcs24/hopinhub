const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.firestore
  .document("rides/{rideId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      const payload = {
        notification: {
          title: "Ride Update",
          body: `Ride is now ${after.status}`,
        },
      };

      // fetch passengers tokens
      const users = await admin.firestore()
        .collection("users")
        .where("uid", "in", after.passengers)
        .get();

      const tokens = users.docs.map(doc => doc.data().fcmToken);

      if (tokens.length) {
        await admin.messaging().sendToDevice(tokens, payload);
      }
    }
  });
