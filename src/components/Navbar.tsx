"use client";

import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (topRef.current && navRef.current) {
        const topBottom = topRef.current.getBoundingClientRect().bottom;
        const navTop = navRef.current.getBoundingClientRect().top;

        // Sticky when navbar-nav reaches the top of the screen
        if (navTop <= 0 && topBottom <= 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false); // Reset when navbar-top comes back into view
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="navbar">
      <div ref={topRef} className="navbar-top">
        <a href="#games" className="headerDaily">
          <img src="/dailyLogo.png" alt="Daily Logo" className="dailyLogo" />
          Dailys
        </a>
        <h1>Elnan</h1>
      </div>

      <div className="navbar-wrapper">
        <nav ref={navRef} className={`navbar-nav ${isSticky ? "sticky" : ""}`}>
          <div className={`logo ${isSticky ? "visible" : ""}`}>Elnan</div>
          <ul>
            <li>
              <button onClick={() => handleNavClick("home")}>Home</button>
            </li>
            <li>
              <button onClick={() => handleNavClick("games")}>Games</button>
            </li>
            <li>
              <button onClick={() => handleNavClick("contact")}>Contact</button>
            </li>
          </ul>
        </nav>
        <a href="#games" className="headerWeekly">
          Weeklys
        </a>
        <img
          src="/notteknekteneLogo.png"
          alt="Notteknektene Logo"
          className="weeklyLogo"
        />
      </div>
    </header>
  );
}
