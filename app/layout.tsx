import type { Metadata } from "next";
import { Geist, Geist_Mono,Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";
const inter =Inter({subsets:["latin"]});


export const metadata: Metadata = {
  title: "Anna Ratnam - Empowering Farmers with AI",
  description: "Anna Ratnam is a platform designed to support farmers with modern technology. Farmers can access crop market prices, ask farming questions through AI, and detect plant diseases quickly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col`}
        >

            <Navbar />  
          {/* {Main Section} */}
          <main className="flex-1">
        {children}
          </main>
          {/* {Footer}  */}
    
        

      </body>
    </html>
    </ClerkProvider>
  );
}
