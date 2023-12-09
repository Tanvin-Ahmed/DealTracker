import Navbar from "@/components/common/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ClerkProvider, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
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
  const { userId } = auth();
  // const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  } else {
    // await saveNewUser({ email: user?.emailAddresses[0].emailAddress });
  }

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
