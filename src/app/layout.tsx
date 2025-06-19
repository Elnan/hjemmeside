import { Gowun_Dodum, Bruno_Ace_SC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const brunoAceSC = Bruno_Ace_SC({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Olav Elnan",
  description:
    "Spill daglige og ukentlige spill, eller kontakt meg for webutvikling, design og underholdning.",
  keywords: [
    "spill",
    "daily games",
    "webutvikling",
    "design",
    "underholdning",
    "Elnan",
    "Olav Elnan",
    "Olav",
    "Storøy",
    "Storoy",
    "Olav Storøy",
    "Olav Elnan Storøy",
    "Olav Elnan Storoy",
    "Olav Elnan Storøy",
    "Olav Elnan Storoy",
    "Elnan Games",
    "Elnan Daily Games",
    "Elnan Web Development",
    "Elnan Design",
    "Elnan Entertainment",
    "ShapeFit",
    "Connections",
    "FallingSquare",
    "Next.js",
    "TypeScript",
  ],
  openGraph: {
    title: "Olav Elnan",
    description:
      "Spill daglige og ukentlige spill, eller kontakt meg for webutvikling, design og underholdning.",
    url: "https://olavelnan.no",
    siteName: "Olav Elnan",
    images: [
      {
        url: "/Elnanlogo.webp",
        width: 400,
        height: 400,
        alt: "Elnan logo",
      },
    ],
    locale: "no_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olav Elnan",
    description:
      "Spill daglige og ukentlige spill, eller kontakt meg for webutvikling, design og underholdning.",
    images: ["/Elnanlogo.webp"],
  },
  icons: {
    icon: "/Elnanlogo.webp",
    shortcut: "/Elnanlogo.webp",
    apple: "/Elnanlogo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${gowunDodum.className} ${brunoAceSC.className}`}
    >
      <body>
        <Navbar />
        <main>{children}</main>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
