"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bruno_Ace_SC } from "next/font/google";

const brunoAceSC = Bruno_Ace_SC({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function DailysNavbar() {
  const { isSignedIn } = useUser();

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
        {isSignedIn && (
          <div className="user-button">
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </nav>
    </header>
  );
}
