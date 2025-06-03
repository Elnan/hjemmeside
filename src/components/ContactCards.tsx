import React, { useState } from "react";
import styles from "./ContactCards.module.css";

export default function ContactCards() {
  const [selected, setSelected] = useState<string | null>(null);
  const handleCardClick = (type: string) => {
    setSelected((prev) => (prev === type ? null : type));
  };
  return (
    <div className={styles.contactCardsWrapper}>
      <div className={styles.contactCardRow}>
        <div
          className={
            selected === "web"
              ? `${styles.contactCard} ${styles.selected}`
              : styles.contactCard
          }
          onClick={() => handleCardClick("web")}
        >
          <div className={styles.contactCardIcon}>🌐</div>
          <div className={styles.contactCardTitle}>Nettside for deg</div>
          <div className={styles.contactCardDesc}>
            Få en moderne, responsiv nettside tilpasset dine behov.
          </div>
        </div>
        <div
          className={
            selected === "event"
              ? `${styles.contactCard} ${styles.selected}`
              : styles.contactCard
          }
          onClick={() => handleCardClick("event")}
        >
          <div className={styles.contactCardIcon}>🎤</div>
          <div className={styles.contactCardTitle}>Underholdning til event</div>
          <div className={styles.contactCardDesc}>
            Gjør arrangementet minneverdig med interaktiv underholdning.
          </div>
        </div>
      </div>
      {selected && (
        <div className={styles.contactCardFormBox}>
          <div className={styles.contactCardFormContent}>
            <div className={styles.contactCardFormLabel}>
              {selected === "web"
                ? "Fortell litt om hva slags nettside du ønsker deg:"
                : "Fortell litt om arrangementet og ønsket underholdning:"}
            </div>
            <textarea
              className={styles.contactCardTextarea}
              placeholder={
                selected === "web"
                  ? "F.eks. 'Jeg ønsker en enkel portefølje/nettbutikk/blogg...'"
                  : "F.eks. 'Vi skal ha sommerfest for jobben, 50 personer...'"
              }
              rows={4}
            />
            <button
              className={styles.contactCardButton}
              onClick={() => {
                // TODO: Koble til backend/epost-tjeneste
                alert(
                  "Takk for din henvendelse! Jeg tar kontakt så snart som mulig."
                );
              }}
            >
              Send forespørsel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
