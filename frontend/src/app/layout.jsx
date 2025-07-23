import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // metadataBase: new URL('http://localhost:3001'), 
  title: "CareerConnect | Find Your Dream Job",
  description:
    "Discover thousands of job opportunities across various industries. Find your perfect career match today.",
  icons: {
    icon: "/logo_c.png", // Path to your favicon (can also be .png, .svg, etc.)
  },
  // openGraph: {
  //   title: "CareerConnect | Find Your Dream Job",
  //   description:
  //     "Discover thousands of job opportunities across various industries. Find your perfect career match today.",
  //   images: [
  //     {
  //       url: "/logo3.png", // Path to your Open Graph image (logo or banner)
  //       width: 800,
  //       height: 600,
  //       alt: "CareerConnect Logo",
  //     },
  //   ],
  // },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 mx-auto w-full flex flex-col justify-center mb-10">
            {children}
          </main>
         <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
