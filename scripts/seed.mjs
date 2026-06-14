import { existsSync, readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

loadEnv(".env.local");

const requiredFirebaseKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingFirebaseKeys = requiredFirebaseKeys.filter((key) => !process.env[key]);

if (missingFirebaseKeys.length) {
  throw new Error(`Variáveis Firebase ausentes: ${missingFirebaseKeys.join(", ")}`);
}

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

if (!process.env.SEED_ADMIN_UID) {
  console.log("Nenhum dado criado. Informe SEED_ADMIN_UID para criar o perfil admin.");
  process.exit(0);
}

const now = new Date().toISOString().slice(0, 10);

await setDoc(
  doc(db, "users", process.env.SEED_ADMIN_UID),
  {
    name: process.env.SEED_ADMIN_NAME ?? "Administrador",
    fullName: process.env.SEED_ADMIN_NAME ?? "Administrador",
    email: process.env.SEED_ADMIN_EMAIL ?? "",
    phone: process.env.SEED_ADMIN_PHONE ?? "",
    avatar: "",
    avatarUrl: "",
    role: "admin",
    marketingConsent: false,
    preferences: {
      notifications: true,
      theme: "light",
    },
    createdAt: now,
    updatedAt: now,
  },
  { merge: true },
);

console.log("Perfil admin criado/atualizado no Firestore.");

function loadEnv(path) {
  if (!existsSync(path)) return;

  const content = readFileSync(path, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    process.env[key] = valueParts.join("=");
  }
}
