import type { Metadata } from "next";
import { Inter, Tiro_Tamil } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdTicker from "../components/AdTicker";
import ClientProviders from "../components/ClientProviders";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from "@/navigation";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
});

// Tiro Tamil: Elegant Tamil font for all elements in Tamil mode
const tiroTamil = Tiro_Tamil({ 
  subsets: ["tamil"], 
  variable: '--font-tiro-tamil',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Al Fattah Matrimony - TN Muslim Matrimony",
  description: "Find your life partner in the Tamil Muslim community with Al Fattah Matrimony.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${tiroTamil.variable}`}>
      <body className="antialiased text-gray-900 bg-[#FCFDFB]">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientProviders>
            <div className="flex flex-col min-h-screen">
              <AdTicker />
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}