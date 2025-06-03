"use client";

import { Bruno_Ace_SC } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import "./Footer.css";

const brunoAceSC = Bruno_Ace_SC({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Legg til/fjern klasse på navbar-nav når footer-logo er animert inn
    const nav = document.querySelector(".navbar-nav");
    if (!nav) return;
    if (isVisible) {
      nav.classList.add("footer-active");
    } else {
      nav.classList.remove("footer-active");
    }
  }, [isVisible]);

  useEffect(() => {
    const nav = document.querySelector(".navbar-nav");
    if (!nav || !footerRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        console.log("Footer observer:", {
          ratio: entry.intersectionRatio,
          top: entry.boundingClientRect.top,
          isIntersecting: entry.isIntersecting,
        });

        if (entry.intersectionRatio >= 0.4) {
          nav.classList.add("footer-almost-full");
        } else {
          nav.classList.remove("footer-almost-full");
        }
      },
      { threshold: [0.4] }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".navbar-nav");
    if (!nav) return;
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
      if (atBottom) {
        nav.classList.add("footer-almost-full");
      } else {
        nav.classList.remove("footer-almost-full");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-page">
      <section className="footer-small">
        <div className="footer-small-content">
          <div className="footer-small-row">
            <div className="footer-small-contact">
              <div>
                Email:{" "}
                <a href="mailto:Olavelnan@gmail.com">Olavelnan@gmail.com</a>
              </div>
              <div>
                Telefon: <a href="tel:+4712345678">+47 12 34 56 78</a>
              </div>
              <div>Adresse: 1234 Oslo, Norge</div>
            </div>
            <div className="footer-small-socials"></div>
            <ul className="footer-small-links">
              <li>
                <a href="https://www.instagram.com/oelnan/">Instagram</a>
              </li>
              <li>
                <a href="https://bsky.app/profile/elbando.bsky.social">
                  Bluesky
                </a>
              </li>
              <li>
                <a href="https://github.com/Elnan">GitHub</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/olav-elnan-1b184990">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-small-copyright">
            &copy; {new Date().getFullYear()} Elnan. All rights reserved.
          </div>
        </div>
      </section>

      <footer
        className={`footer-large ${isVisible ? "visible" : ""}`}
        ref={footerRef}
      >
        <div className="footer-large-content">
          <div className="footer-large-logo">
            <div className={`footer-logo ${brunoAceSC.className}`}>
              {"Elnan".split("").map((char, i) => (
                <span key={i} className={`footer-logo-letter letter-${i + 1}`}>
                  {char}
                </span>
              ))}
            </div>
          </div>
          <div className="footer-large-links-wrapper">
            <div className="footer-large-contact">
              <div>
                Email:{" "}
                <a href="mailto:Olavelnan@gmail.com">Olavelnan@gmail.com</a>
              </div>
              <div>
                Telefon: <a href="tel:+4712345678">+47 12 34 56 78</a>
              </div>
              <div>Adresse: 1234 Oslo, Norge</div>
            </div>
            <div className="footer-large-weeklys">
              <strong>Weeklys</strong>
              <ul></ul>
            </div>
            <div className="footer-large-dailys">
              <strong>Dailys</strong>
              <ul></ul>
            </div>

            <div className="footer-large-sitemap">
              <strong style={{ textDecoration: "underline" }}>Sitemap</strong>
              <ul className="footer-large-sitemap-links">
                <li>
                  <a href="#home">Hjem</a>
                </li>
                <li>
                  <a href="#games">Spill</a>
                </li>
                <li>
                  <a href="#contact">Kontakt</a>
                </li>
                <li>
                  <a href="#privacy">Personvern</a>
                </li>
                <li>
                  <a href="#terms">Vilkår</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-large-socials">
            <a href="https://www.instagram.com/oelnan/">Instagram</a> |
            <a href="https://bsky.app/profile/elbando.bsky.social">Bluesky</a> |
            <a href="https://github.com/Elnan">GitHub</a> |
            <a href="https://www.linkedin.com/in/olav-elnan-1b184990">
              LinkedIn
            </a>
          </div>
          <div className="footer-large-copyright">
            &copy; {new Date().getFullYear()} Elnan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
