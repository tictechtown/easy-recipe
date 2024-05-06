import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "My Easy Recipes",
  title: "EasyRecipe",
  description: "Get your favorite web recipes all in one place",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My Easy Recipes",
    // startUpImage: [],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" /*data-theme="retro"*/>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
      />

      <body className={inter.className}>{children}</body>
    </html>
  );
}
