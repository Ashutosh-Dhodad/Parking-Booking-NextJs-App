// src/firestoreService.js
import { db } from "../Services/firebaseConfig"; // Adjust the import path as needed
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const slotsCol = collection(db, "parking_slots");

export async function fetchSlots() {
  const snapshot = await getDocs(slotsCol);
  const slots = [];
  snapshot.forEach((d) => {
    const data = d.data();
    slots.push({ id: d.id, bookedBy: data.bookedBy ?? null });
  });

  // Ensure P1..P10 exist client-side even if DB empty
  const existing = new Map(slots.map((s) => [s.id, s]));
  for (let i = 1; i <= 10; i++) {
    const id = `P${i}`;
    if (!existing.has(id)) slots.push({ id, bookedBy: null });
  }

  slots.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return slots;
}

export async function bookSlot(id, userName) {
  const ref = doc(db, "parking_slots", id);
  await setDoc(ref, { bookedBy: userName, updatedAt: new Date() }, { merge: true });
}

export async function freeSlot(id) {
  const ref = doc(db, "parking_slots", id);
  await setDoc(ref, { bookedBy: null, updatedAt: new Date() }, { merge: true });
}

export async function getSlotById(id) {
  const ref = doc(db, "parking_slots", id);
  const s = await getDoc(ref);
  if (!s.exists()) return { id, bookedBy: null };
  const data = s.data();
  return { id, bookedBy: data.bookedBy ?? null };
}

/**
 * Subscribe to real-time updates for parkingSlots collection.
 * @param {function} onSlotsUpdate Callback fired with updated slots array on every change.
 * @returns {function} Unsubscribe function to stop listening.
 */
export function subscribeToSlots(onSlotsUpdate) {
  return onSnapshot(slotsCol, (snapshot) => {
    const slots = [];
    snapshot.forEach((d) => {
      const data = d.data();
      slots.push({ id: d.id, bookedBy: data.bookedBy ?? null });
    });

    // Ensure P1..P10 exist client-side even if DB empty
    const existing = new Map(slots.map((s) => [s.id, s]));
    for (let i = 1; i <= 10; i++) {
      const id = `P${i}`;
      if (!existing.has(id)) slots.push({ id, bookedBy: null });
    }

    slots.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

    onSlotsUpdate(slots);
  });
}
