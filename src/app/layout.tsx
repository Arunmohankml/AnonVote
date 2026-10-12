import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AnonVote — Privacy-Preserving Campus Blockchain Voting | SRM IST",
  description:
    "From cryptic logic to clean ballot integrity in seconds. Campus micro-voting separating voter eligibility from the ballot using zero-knowledge credentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
