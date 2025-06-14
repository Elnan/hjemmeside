import React, { useState, useRef, useEffect } from "react";
import styles from "./ContactCards.module.css";

export default function ContactCards() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);

  const handleCardClick = (type: string) => {
    setSelected((prev) => (prev === type ? null : type));
  };

  return (
    <div className={styles.contactCardsWrapper}>
      <div className={styles.serviceTitle}>
        <p>Velg en kontaktløsning som passer for deg!</p>
      </div>
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
          <div className={styles.contactCardTitle}>Nettsideutvikling</div>
          <div className={styles.contactCardDesc}>
            Skreddersydde nettsider bygget med moderne teknologi og beste
            praksis. Fra enkle landingssider til avanserte webapplikasjoner.
          </div>
          <ul className={styles.serviceFeatures}>
            <li>Responsivt design</li>
            <li>SEO-optimalisering</li>
            <li>Fokus på ytelse</li>
            <li>Moderne brukeropplevelse</li>
          </ul>
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
          <div className={styles.contactCardTitle}>
            Underholdning til arrangement
          </div>
          <div className={styles.contactCardDesc}>
            Interaktive underholdningsløsninger for bedrifter, private fester og
            spesielle anledninger.
          </div>
          <ul className={styles.serviceFeatures}>
            <li>Skreddersydde opplegg</li>
            <li>Interaktive spill og oppgaver</li>
            <li>Profesjonell gjennomføring</li>
            <li>Alle gruppestørrelser</li>
          </ul>
        </div>

        <div
          className={
            selected === "other"
              ? `${styles.contactCard} ${styles.selected}`
              : styles.contactCard
          }
          onClick={() => handleCardClick("other")}
        >
          <div className={styles.contactCardIcon}>💡</div>
          <div className={styles.contactCardTitle}>Andre henvendelser</div>
          <div className={styles.contactCardDesc}>
            Har du et annet prosjekt i tankene? Jeg er alltid åpen for spennende
            samarbeid og muligheter.
          </div>
          <ul className={styles.serviceFeatures}>
            <li>Konsulentbistand</li>
            <li>Samarbeid</li>
            <li>Skreddersydde prosjekter</li>
            <li>Generelle spørsmål</li>
          </ul>
        </div>
      </div>{" "}
      {selected && (
        <div className={styles.contactCardFormBox} ref={formRef}>
          <div className={styles.contactCardFormContent}>
            <div className={styles.contactCardFormLabel}>
              {selected === "web" && (
                <>
                  <h3>Nettsideutvikling</h3>
                  <p>Beskriv gjerne prosjektet og dine ønsker:</p>
                </>
              )}
              {selected === "event" && (
                <>
                  <h3>Underholdning til arrangement</h3>
                  <p>Del litt om arrangementet og hva du ser for deg:</p>
                </>
              )}
              {selected === "other" && (
                <>
                  <h3>Annen henvendelse</h3>
                  <p>Hvordan kan jeg hjelpe deg?</p>
                </>
              )}
            </div>
            <form
              className={styles.contactForm}
              onSubmit={async (e) => {
                e.preventDefault();
                setSending(true);
                setError(null);
                const form = e.currentTarget;
                const name = (form.elements[0] as HTMLInputElement).value;
                const email = (form.elements[1] as HTMLInputElement).value;
                const message = (form.elements[2] as HTMLTextAreaElement).value;

                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name,
                    email,
                    message,
                    service: selected,
                  }),
                });

                setSending(false);
                if (res.ok) {
                  setSent(true);
                  form.reset();
                } else {
                  setError("Noe gikk galt, prøv igjen senere.");
                }
              }}
            >
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Ditt navn"
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Din e-post"
                  className={styles.formInput}
                  required
                />
              </div>
              <textarea
                className={styles.contactCardTextarea}
                placeholder={
                  selected === "web"
                    ? "Beskriv hva slags nettside du ønsker (f.eks. type, funksjoner, tidsramme...)"
                    : selected === "event"
                      ? "Fortell litt om arrangementet (type, dato, antall gjester, varighet...)"
                      : "Hvordan kan jeg hjelpe deg?"
                }
                rows={4}
                required
              />
              <button
                type="submit"
                className={styles.contactCardButton}
                disabled={sending}
              >
                {sending ? "Sender..." : "Send henvendelse"}
              </button>
              {sent && (
                <div className={styles.successMsg}>
                  Takk for din henvendelse!
                </div>
              )}
              {error && <div className={styles.errorMsg}>{error}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
