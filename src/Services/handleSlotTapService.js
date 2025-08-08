import { useState, useEffect, useRef } from "react";
import { FaInfoCircle, FaParking } from "react-icons/fa";
import { bookSlot, freeSlot } from "../Services/firestoreService";
import styles from "../styles/slotModal.module.css";

export function useHandleSlotTap(reloadSlots) {
  const [modalData, setModalData] = useState(null);
  const inputRef = useRef(null);

  const handleSlotTap = (id, isBooked, bookedByName) => {
    if (isBooked) {
      setModalData({
        type: "booked",
        id,
        bookedByName,
      });
    } else {
      setModalData({
        type: "free",
        id,
        name: "",
      });
    }
  };

  // Autofocus input when free slot modal opens
  useEffect(() => {
    if (modalData?.type === "free" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalData]);

  const confirmFreeSlot = async (id) => {
    await freeSlot(id);
    setModalData(null);
    reloadSlots();
  };

  const confirmBookSlot = async (id, name) => {
    if (!name.trim()) return;
    await bookSlot(id, name.trim());
    setModalData(null);
    reloadSlots();
  };

  const Modal = () => {
    if (!modalData) return null;

    return (
      <div className={styles.overlay}>
        <div className={styles.dialog}>
          {/* Title */}
          <div className={styles.titleRow}>
            {modalData.type === "booked" ? (
              <FaInfoCircle className={styles.redIcon} />
            ) : (
              <div className={styles.parkingIconCircle}>
                <FaParking className={styles.greenIcon} />
              </div>
            )}
            <h2 className={styles.title}>
              {modalData.type === "booked"
                ? "Slot Booked"
                : `Book Slot ${modalData.id}`}
            </h2>
          </div>

          {/* Content */}
          {modalData.type === "booked" ? (
            <>
              <p className={styles.textCenter}>
                This slot is booked by:{" "}
                <span className={styles.bookedBy}>
                  {modalData.bookedByName || "Unknown"}
                </span>
              </p>
              <p className={styles.textCenter}>Do you want to free this slot?</p>
            </>
          ) : (
            <>
              <p className={styles.textCenter}>
                Enter your name to confirm the booking.
              </p>
              <input
                ref={inputRef}
                type="text"
                placeholder="Your Name"
                className={styles.input}
                value={modalData.name}
                autoComplete="off"
                autoCorrect="off"
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
              />
            </>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={() => setModalData(null)}
            >
              Cancel
            </button>
            {modalData.type === "booked" ? (
              <button
                className={styles.freeButton}
                onClick={() => confirmFreeSlot(modalData.id)}
              >
                Free
              </button>
            ) : (
              <button
                className={styles.bookButton}
                onClick={() => confirmBookSlot(modalData.id, modalData.name)}
                disabled={!modalData.name.trim()}
                style={{
                  opacity: modalData.name.trim() ? 1 : 0.6,
                  cursor: modalData.name.trim() ? "pointer" : "not-allowed",
                }}
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return { handleSlotTap, Modal };
}
