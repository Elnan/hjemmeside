import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bruno_Ace_SC, Gowun_Dodum } from "next/font/google";

const brunoAceSC = Bruno_Ace_SC({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const gowunDodum = Gowun_Dodum({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={gowunDodum.className}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
