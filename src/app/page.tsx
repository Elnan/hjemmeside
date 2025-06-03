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
              }, 600); // Forsinkelse på 500ms før animasjonen starter
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
      logo: "./bluesky.png",
      link: "https://bsky.app/profile/elbando.bsky.social",
    },
    { name: "GitHub", logo: "./github2.png", link: "https://github.com/Elnan" },
    {
      name: "Instagram",
      logo: "./instagram.png",
      link: "https://www.instagram.com/oelnan/",
    },
    {
      name: "LinkedIn",
      logo: "./linkedin2.png",
      link: "https://www.linkedin.com/in/olav-elnan-1b184990",
    },
  ];

  return (
    <div>
      <section id="home" className={`${styles.section} ${styles.homeSection}`}>
        <div className={styles.content}>
          <h1>Welcome to My Website</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iure
            amet voluptatibus, non facere harum impedit adipisci odio qui, iusto
            ad officiis voluptatem aut ipsum corporis quia aperiam unde ea
            cumque reprehenderit nisi? Rem, hic. Asperiores quia, totam eligendi
            aliquid possimus magni deserunt similique vel soluta? Ullam non in
            temporibus tempore, maxime quod quasi architecto ipsa aut nesciunt
            autem nulla excepturi asperiores perspiciatis sed alias quae?
          </p>
          <div className={styles.cylinder}></div>
        </div>
      </section>

      <section
        id="games"
        className={`${styles.section} ${styles.gamesSection}`}
      >
        <div className={styles.content}>
          <h1>Games</h1>
          <p>
            Her vil det komme daglige spill som du kan spille, enten alene,
            eller konkurrere med venner. Det vil også komme ukentlige spill som
            du kan spille for å vinne premier. Spillene vil variere fra
            ordspill, sudoku, og andre utfordringer. Dette er for tiden under
            konstruksjon, og dermed ikke tilgjengelig enda. Følg med for å se
            hvilke spill som er tilgjengelige!
          </p>
          <div className={styles.gamesContainer}>
            <div className={`${styles.gamesLogoSquare} ${styles.dailyLogo}`}>
              <span>Daily</span>
            </div>
            <div className={`${styles.gamesLogoSquare} ${styles.weeklyLogo}`}>
              <span>Weekly</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className={`${styles.section} ${styles.contactSection}`}
      >
        <div className={styles.content}>
          <h1>Contact</h1>
          <p>
            Her kommer en tekst om tjenester jeg tilbyr, som nettsider,
            underholdning til eventer, osv. Dette er en kort introduksjon til
            hva jeg kan hjelpe deg med. Hvis du er interessert i å vite mer, kan
            du ta kontakt med meg via kontaktskjemaet nedenfor.
          </p>
          <ContactCards />
          <p>Follow on social media:</p>
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
                      alt={social.name}
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
