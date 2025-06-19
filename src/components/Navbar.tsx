"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Bruno_Ace_SC } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

const brunoAceSC = Bruno_Ace_SC({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isDailysPage = pathname === "/dailys";

  useEffect(() => {
    const handleScroll = () => {
      if (!isDailysPage && topRef.current && navRef.current) {
        const topBottom = topRef.current.getBoundingClientRect().bottom;
        const navTop = navRef.current.getBoundingClientRect().top;
        if (navTop <= 0 && topBottom <= 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDailysPage]);

  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const dailyButtonContent = (
    <>
      <Image
        src="/dailyLogo.webp"
        alt="Daily Logo"
        className="dailyLogo"
        width={40}
        height={40}
      />
      Dailys
    </>
  );

  if (isDailysPage) {
    return (
      <header className="navbar">
        <nav className="navbar-nav sticky">
          <Link href="/" className={`logo visible ${brunoAceSC.className}`}>
            Elnan
          </Link>
          <ul>
            <li>
              <a
                href="/#home"
                className="navButton"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    const section = document.getElementById("home");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Hjem
              </a>
            </li>
            <li>
              <a
                href="/#games"
                className="navButton"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    const section = document.getElementById("games");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Spill
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="navButton"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    const section = document.getElementById("contact");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Kontakt
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <header className="navbar">
      <div ref={topRef} className="navbar-top">
        <Link href="/dailys" className="headerDaily" tabIndex={0}>
          {dailyButtonContent}
        </Link>
        <h1 className={brunoAceSC.className}>Elnan</h1>
      </div>
      <div className="navbar-wrapper">
        <div
          className="navbar-placeholder"
          style={{ display: isSticky ? "block" : "none" }}
        />
        <nav ref={navRef} className={`navbar-nav ${isSticky ? "sticky" : ""}`}>
          <div
            className={`logo ${isSticky ? "visible" : ""} ${brunoAceSC.className}`}
            onClick={() => {
              const homeSection = document.getElementById("home");
              if (homeSection) {
                homeSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{ cursor: "pointer" }}
            tabIndex={-1}
          >
            Elnan
          </div>
          <ul>
            <li>
              <button onClick={() => handleNavClick("home")}>Hjem</button>
            </li>
            <li>
              <button onClick={() => handleNavClick("games")}>Spill</button>
            </li>
            <li>
              <button onClick={() => handleNavClick("contact")}>Kontakt</button>
            </li>
          </ul>
        </nav>
        <div className="weeklyLinkWrapper">
          <a
            href="https://spill.kikunnskap.no/"
            className="headerWeekly"
            tabIndex={0}
          >
            Weeklys
          </a>
          <Image
            src="/notteknekteneLogo.webp"
            alt="Notteknektene Logo"
            className="weeklyLogo"
            width={40}
            height={40}
          />
        </div>
      </div>
    </header>
  );
}
