import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Al Fattah Matrimony",
  description: "TN Muslim Matrimony",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <Navbar />

          <div className="min-h-[calc(100vh-160px)]">{children}</div>

          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}