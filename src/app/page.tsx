"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import ContactCards from "../components/ContactCards";
import Image from "next/image";

export default function Home() {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const trapdoorRefs = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = trapdoorRefs.current.indexOf(
            entry.target as HTMLLIElement
          );

          if (index !== -1) {
            if (entry.isIntersecting) {
              // Legg til elementet i visibleIndexes når det er synlig
              setTimeout(() => {
                setVisibleIndexes((prev) => [...new Set([...prev, index])]);
              }, 600); // Forsinkelse på 600ms før animasjonen starter
            } else {
              // Fjern elementet fra visibleIndexes når det ikke lenger er synlig
              setVisibleIndexes((prev) => prev.filter((i) => i !== index));
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger når 50% av elementet er synlig
    );

    trapdoorRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    const anchor = document.getElementById("footer-anchor");
    if (anchor) observer.observe(anchor);

    return () => observer.disconnect();
  }, []);

  const socialMedia = [
    {
      name: "Bluesky",
      logo: "/bluesky.webp",
      link: "https://bsky.app/profile/elbando.bsky.social",
    },
    { name: "GitHub", logo: "/github.webp", link: "https://github.com/Elnan" },
    {
      name: "Instagram",
      logo: "/instagram.webp",
      link: "https://www.instagram.com/oelnan/",
    },
    {
      name: "LinkedIn",
      logo: "/linkedin.webp",
      link: "https://www.linkedin.com/in/olav-elnan-1b184990",
    },
  ];

  return (
    <div>
      <section id="home" className={`${styles.section} ${styles.homeSection}`}>
        <div className={styles.content}>
          <h1>Velkommen</h1>
          <p>
            Jeg er en utvikler og problemløser med lidenskap for teknologi,
            design og spill. På denne siden finner du et utvalg av mine
            prosjekter, tjenester og interaktive spill
            <br />
            <br />
            - alt laget for å engasjere, utfordre og inspirere -
            <br />
            <br />
            Enten du ønsker en moderne nettside, underholdning til
            arrangementer, eller bare er nysgjerrig på hva jeg kan tilby, er du
            hjertelig velkommen til å utforske. Ta gjerne kontakt for en
            uforpliktende prat om dine behov eller idéer!
          </p>
          <div className={styles.cylinder}></div>
        </div>
      </section>

      <section
        id="games"
        className={`${styles.section} ${styles.gamesSection}`}
      >
        <div className={styles.content}>
          <h1>Spill</h1>
          <p>
            Jeg har et pågående prosjekt om å lage spill som kan underholde og
            utfordre deg. Her er det spill som du kan spille, enten alene, eller
            konkurrere med venner. Det vil også komme ukentlige eller
            sesongbaserte spill etterhvert. Spillene vil variere fra ordspill,
            sudoku, og andre utfordringer.
            <br />
            Dette er for tiden under konstruksjon, så følg med for å se hvilke
            spill som er tilgjengelige!
          </p>
          <div className={styles.gamesContainer}>
            <button
              className={`${styles.gameButton} ${styles.dailyButton}`}
              onClick={() => window.open("/dailys", "_self")}
            >
              <span className={styles.gameButtonTitle}>Dailys</span>
              <span className={styles.gameButtonText}>
                Nye utfordringer hver dag
              </span>
            </button>
            <button
              className={`${styles.gameButton} ${styles.weeklyButton}`}
              onClick={() =>
                window.open("https://spill.kikunnskap.no/", "_blank")
              }
            >
              <span className={styles.gameButtonTitle}>Weeklys</span>
              <span className={styles.gameButtonText}>
                Ukentlige spill og konkurranser
                <br />
                (Ekstern lenke)
              </span>
            </button>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className={`${styles.section} ${styles.contactSection}`}
      >
        <div className={styles.content}>
          <h1>Kontakt</h1>
          <p>
            Ta gjerne kontakt for en uforpliktende prat om dine behov,
            prosjekter eller idéer. Jeg tilbyr tjenester innen{" "}
            <span className={styles.contactRed}>
              webutvikling, design og spillutvikling
            </span>
            , samt{" "}
            <span className={styles.contactGreen}>
              underholdningspakker til arrangementer
            </span>
            . Fyll ut kontaktskjemaet nedenfor, så svarer jeg deg så raskt som
            mulig. Ser frem til å høre fra deg!
          </p>
          <ContactCards />
          <p>Følg meg:</p>
          <ul className={styles.socialsWrapper}>
            {socialMedia.map((social, index) => (
              <li
                key={social.name}
                className={`${styles.trapdoorContainer} ${
                  visibleIndexes.includes(index) ? styles.open : ""
                }`}
                ref={(el) => {
                  if (el) {
                    trapdoorRefs.current[index] = el;
                  }
                }}
              >
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <div className={styles.socialIconContainer}>
                    <Image
                      src={social.logo}
                      alt={`Ikon for ${social.name}`}
                      className={styles.socialIcon}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className={styles.textRectangle}>
                    <span>{social.name}</span>
                  </div>
                </a>

                {/* Trapdoors */}
                <div className={`${styles.trapdoor} ${styles.top}`}></div>
                <div className={`${styles.trapdoor} ${styles.bottom}`}></div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
