import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css'
// import Navbar from "./_components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kingsman",
  description: "Developed by DEVENGERS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Navbar/> */}
        {children}
        </body>
    </html>
  );
}
