import Navbar from "@/components/common/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ToastProvider from "@/components/providers/ToastProvider";

// const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DealTracker",
  description:
    "Track product prices effortlessly and save money on your online shopping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <ClerkProvider>
          <main className="max-w-10xl mx-auto">
            <ToastProvider />
            <Navbar />
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
