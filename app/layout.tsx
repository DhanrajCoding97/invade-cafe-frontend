// import { createClient } from "@/lib/supabase/server"
import AuthSlot from "@/components/AuthSlot"
import { Orbitron } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import SmoothScroll from "@/components/SmoothScroll"
import NavBar from "./components/neonblade-ui/navbar"
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const supabase = await createClient()

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", orbitron.variable)}
    >
      <body>
        <SmoothScroll>
          {/* <NavBar
            variant="standard"
            position="fixed"
            transparency="transparent"
            color="cyan"
            logoText="Invade"
            scrollEffect
            hideOnScroll
            items={[
              { label: "Home", href: "#hero" },
              { label: "Services", href: "#services" },
              { label: "Pricing", href: "#pricing" },
              { label: "Testimonials", href: "#testimonials" },
            ]}
          /> */}
          <NavBar
            variant="standard"
            position="fixed"
            transparency="transparent"
            color="cyan"
            logoText="Invade"
            scrollEffect
            hideOnScroll
            navAlign="center"
            items={[
              { label: "Home", href: "#hero" },
              { label: "Services", href: "#services" },
              { label: "Pricing", href: "#pricing" },
              { label: "Testimonials", href: "#testimonials" },
              { label: "Contact", href: "#contact" },
            ]}
            authSlot={<AuthSlot />}
          />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
