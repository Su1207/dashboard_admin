importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCfgHUaCLpoMVyZxG4nOp0beJXfDGaPqrc",
  authDomain: "test-32c68.firebaseapp.com",
  databaseURL:
    "https://test-32c68-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-32c68",
  storageBucket: "test-32c68.appspot.com",
  messagingSenderId: "923230381348",
  appId: "1:923230381348:web:4c290a6a4c186350ea3fb1",
  measurementId: "G-F2CHB4XQ6Q",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
