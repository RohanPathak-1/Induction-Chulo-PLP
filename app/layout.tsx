import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Induction Chulo | VoltMart Nepal",
  description: "आधुनिक भान्सा, सहज जीवन। Induction Chulo को विशेष अफर र Cash on Delivery अर्डर।",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Induction Chulo – Modern Electric Cooking Solution",
    description: "अब खाना पकाउने झन्झट कम, आधुनिक इन्डक्सन चुलोसँग!",
    images: ["/products/induction-angle.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-language="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var l=localStorage.getItem('voltmart-language')==='ne'?'ne':'en';document.documentElement.lang=l;document.documentElement.dataset.language=l;if(l==='ne')document.documentElement.classList.add('language-pending')}catch(e){}})();` }} />
      </head>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
