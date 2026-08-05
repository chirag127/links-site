import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  type Firestore,
} from 'firebase/firestore'

const cfg = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
}

let db: Firestore | null = null

export function firestore(): Firestore | null {
  if (!cfg.projectId) return null
  const app: FirebaseApp = getApps()[0] ?? initializeApp(cfg)
  db ??= getFirestore(app)
  return db
}

// User field-notebook: pressed specimens (saved site slugs), keyed by Clerk user id.
const ref = (uid: string) => {
  const d = firestore()
  return d ? doc(d, 'links_notebooks', uid) : null
}

export async function loadPressed(uid: string): Promise<string[]> {
  const r = ref(uid)
  if (!r) return []
  const snap = await getDoc(r)
  return (snap.exists() ? (snap.data().pressed as string[]) : []) ?? []
}

export async function savePressed(uid: string, pressed: string[]): Promise<void> {
  const r = ref(uid)
  if (!r) return
  await setDoc(r, { pressed, updatedAt: Date.now() }, { merge: true })
}
