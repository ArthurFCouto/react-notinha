import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);

export const ErrorMappingLogin = (message: string) => {
  let response =
    'Houve um erro inesperado, entre em contato com nosso suporte ou tente mais tarde.';
  const errorsMap = {
    'auth/invalid-login-credentials': 'Usuário/Senha incorreta',
    'auth/invalid-email': 'Favor informar um email válido.',
    'auth/email-already-in-use': 'Este e-mail já está sendo utilizado.',
    'auth/weak-password': 'A senha deve ter no mínimo 6 caracteres.',
  };
  for (const [key, value] of Object.entries(errorsMap)) {
    if (key == message) {
      response = value;
      break;
    }
  }
  return response;
};

export default initializeApp(firebaseConfig);
