import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/components/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from "@/components/toast"
import WhatsAppChat from "@/components/whatsAppChat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "componentPulse",
  description:
    "Uganda's premier destination for electronic components, development boards, microcontrollers, sensors, and embedded systems training. Shop Arduino, Raspberry Pi, ESP32, STM32 and more.",
  keywords:
    "componentPulse, electronics, embedded systems, Arduino, Raspberry Pi, microcontrollers, sensors, development boards, Uganda, Kampala",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider> {/* ✅ Fixed: ensures useAuth() works */}
            <CartProvider>
              {children}
              <ToastContainer />
              <WhatsAppChat />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
