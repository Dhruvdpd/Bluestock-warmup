import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const firebaseService = {
  createUser: async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  signIn: async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  sendEmailVerification: async (user) => {
    return await sendEmailVerification(user);
  },

  setupRecaptcha: (containerId) => {
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA resolved');
      },
    });
  },

  sendOTP: async (phoneNumber, recaptchaVerifier) => {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  },

  verifyOTP: async (confirmationResult, code) => {
    return await confirmationResult.confirm(code);
  },

  getIdToken: async (user) => {
    return await user.getIdToken();
  },
};

export default app;