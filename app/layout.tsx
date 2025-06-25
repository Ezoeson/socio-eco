import type { Metadata } from "next";
import { Mooli } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";


const mooli = Mooli({
  weight: "400",
  variable: "--font-mooli",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Magnirike",
  description:
    "Gestion d'une application concernant la bancarisation de socio-economiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={mooli.className} lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
