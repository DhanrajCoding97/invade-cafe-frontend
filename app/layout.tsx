// import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
// import { Orbitron } from "next/font/google"
// import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
// import { cn } from "@/lib/utils"
// import SmoothScroll from "@/components/SmoothScroll"
// const orbitron = Orbitron({
//   subsets: ["latin"],
//   variable: "--font-orbitron",
// })

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className={cn("antialiased", orbitron.variable)}
//     >
//       <body>
//         {/* <ThemeProvider>
//           </ThemeProvider> */}
//         <SmoothScroll>{children}</SmoothScroll>
//       </body>
//     </html>
//   )
// }

import { Geist, Orbitron } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import SmoothScroll from "@/components/SmoothScroll"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", orbitron.variable)}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
