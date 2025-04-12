// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  signOut,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { firebaseConfig } from "./firebase_config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function signin_firebase(input_email, input_password) {
  return new Promise((resolve) => {
    signInWithEmailAndPassword(auth, input_email, input_password)
      .then((userCredential) => {
        const user = userCredential.user;

        let user_id = user.uid;
        // Successfully signed in
        resolve(user_id);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential") {
          resolve("Error,Incorrect email or password.");
          //   alert("Incorrect email or password");
        } else {
          //  alert("Account doesn't exist!");
          resolve("Error,Account doesnt exist.");
        }
        // resolve(null);
      });
  });
}

export async function signup_firebase(input_email, input_password) {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, input_email, input_password)
      .then((userCredential) => {
        const user = userCredential.user;
        let user_id = user.uid;
        //alert(user_id);
        resolve(user_id); // Failed to sign in
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == "auth/email-already-in-use") {
          //   alert("Email Address Already Exists !!!', 'signUpMessage");
          resolve("Error,Email Address Already Exists"); // Failed to sign in
        } else {
          //  alert("unable to create User', 'signUpMessage");
          resolve("Error,Unable to create User");
        }
        // resolve(null); // Failed to sign in
      });
  });
}

export async function signout_firebase() {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        resolve("Success");
      })
      .catch((error) => {
        resolve(null);
      });
  });
}
