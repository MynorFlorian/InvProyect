import "firebase/compat/messaging";
import firebase from "firebase/compat/app";
import localforage from "localforage";

const firebaseCloudMessaging = {

  init: async () => {
    if (!firebase?.apps.length) {
      // Initialize the Firebase app with the credentials
      firebase?.initializeApp({
        apiKey: process.env.APIKEY,
        authDomain: process.env.AUTHDOMAIN,
        projectId: process.env.PROJECTID,
        storageBucket: process.env.STORAGEBUCKET,
        messagingSenderId: process.env.MESSAGINGSENDERIR,
        appId: process.env.APPID
      });

      try {
        const messaging = firebase.messaging();
        const tokenInLocalForage = await localforage.getItem("fcm_token");

         // Return the token if it is alredy in our local storage
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }

        // Request the push notification permission from browser
        const status = await Notification.requestPermission();
        console.log("status", status);
        if (status && status === "granted") {
        // Get new token from Firebase
          const fcm_token = await messaging.getToken({
            vapidKey: process.env.MESSAGINGAPIKEY,
          });

          console.log("FCM tokens: ", fcm_token);

          // Set token in our local storage
          if (fcm_token) {
            console.log("FCM token: ", fcm_token);
            localforage.setItem("fcm_token", fcm_token);
            return fcm_token;
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};
export { firebaseCloudMessaging };
