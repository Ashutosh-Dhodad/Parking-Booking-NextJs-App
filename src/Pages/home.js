import { useEffect, useState } from "react";
import { subscribeToSlots } from "../Services/firestoreService"; // use real-time subscription
import { useHandleSlotTap } from "../Services/handleSlotTapService";
import { auth } from "../Services/firebaseConfig";
import { signOut } from "firebase/auth";
import styles from "../styles/home.module.css";
import { FaCarAlt, FaParking, FaSignOutAlt } from "react-icons/fa";

export default function Home() {
  const [slots, setSlots] = useState([]);
  const { handleSlotTap, Modal } = useHandleSlotTap(() => {});

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToSlots(setSlots);

    return () => {
      unsubscribe(); // cleanup on unmount
    };
  }, []);

  function isBooked(id) {
    return slots.some((slot) => slot.id === id && slot.bookedBy);
  }

  function bookedBy(id) {
    const slot = slots.find((slot) => slot.id === id);
    return slot?.bookedBy || null;
  }

  async function logout() {
    await signOut(auth);
    window.location.href = "/login";
  }

  return (
    <div className={styles.page}>
      <header className={styles.appBar}>
        <h1>Parking Slots</h1>
        <button className={styles.logoutBtn} onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <div className={styles.card}>
        <div className={styles.grid}>
          {Array.from({ length: 10 }, (_, i) => {
            const id = `P${i + 1}`;
            const booked = isBooked(id);

            return (
              <div
                key={id}
                className={`${styles.slot} ${booked ? styles.booked : styles.available}`}
                onClick={() => handleSlotTap(id, booked, bookedBy(id))}
              >
                {booked ? (
                  <FaCarAlt className={styles.slotIconBooked} />
                ) : (
                  <FaParking className={styles.slotIconAvailable} />
                )}
                <span className={styles.slotId}>{id}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Modal />
    </div>
  );
}
