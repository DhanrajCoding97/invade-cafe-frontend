"use client"
import { Orbitron } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import SmoothScroll from "@/components/SmoothScroll"
import NavBar from "./components/neonblade-ui/navbar"
import { FcGoogle } from "react-icons/fc"
import CornerCutButton from "./components/neonblade-ui/corner-cut-button"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import SignInWithGoogle from "@/components/SignInWithGoogle"
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
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
            authSlot={
              // <CornerCutButton
              //   cornerSize={0}
              //   size="sm"
              //   color="cyan"
              //   variant="outline"
              //   hoverEffect="default"
              //   onClick={() => router.push("/login")}
              // >
              //   Login
              //   <FcGoogle />
              // </CornerCutButton>
              // <Button variant="secondary" className="cursor-pointer">
              //   {" "}
              //   Login <FcGoogle />{" "}
              // </Button>
              <SignInWithGoogle />
            }
          />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
