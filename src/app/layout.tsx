import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import "./globals.css";
import theme from "../theme";
import Providerstore from "../components/FixProvider/Provider.store";
import Notes from "../components/FixProvider/Notes";
import ResponsiveAppBar from "../components/Navbar/Navbar";
import ProtectRouting from "../components/ProtectedRoutes/ProtectRouting";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {






  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Providerstore>
              <Notes>
                <ResponsiveAppBar />
                <ProtectRouting>
                {children}
                </ProtectRouting>
              </Notes>
            </Providerstore>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
