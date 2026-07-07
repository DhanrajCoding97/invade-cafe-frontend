"use client"

// import { Review } from "@/types"
// import "./reviews-section.css"

// const reviews: Review[] = [
//   {
//     id: "1",
//     name: "Rohan Mehta",
//     rating: 5,
//     text: "Best gaming cafe in the city. The rigs are seriously high-end and the VR sets never lag.",
//   },
//   {
//     id: "2",
//     name: "dhanraj shetty",
//     rating: 5,
//     text: "Booked a PS5 station with friends, super smooth process and staff was helpful.",
//   },
//   {
//     id: "3",
//     name: "loki",
//     rating: 5,
//     text: "Best gaming cafe in the city. The rigs are seriously high-end and the VR sets never lag.",
//   },
//   {
//     id: "4",
//     name: "pranav timse",
//     rating: 5,
//     text: "Booked a PS5 station with friends, super smooth process and staff was helpful.",
//   },
// ]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-[#FFC145]" : "text-white/15"}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// function ReviewCard({ review }: { review: Review }) {
//   const initial = review.name.trim().charAt(0).toUpperCase()
//   return (
//     <div className="review-card flex w-[320px] shrink-0 flex-col gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00d4ff]/10 text-sm font-semibold text-[#00d4ff]">
//           {initial}
//         </div>
//         <div className="min-w-0">
//           <p className="truncate text-sm font-semibold text-white">
//             {review.name}
//           </p>
//           <StarRating rating={review.rating} />
//         </div>
//         <span className="ml-auto shrink-0 text-xs text-white/30">
//           via Google
//         </span>
//       </div>
//       <p className="line-clamp-4 text-sm leading-relaxed text-[#9a9a9a]">
//         {review.text}
//       </p>
//     </div>
//   )
// }

// export default function Reviews() {
//   return (
//     <section className="overflow-hidden bg-black px-6 py-20">
//       <div className="mx-auto mb-12 max-w-6xl">
//         <div className="my-4 flex items-center gap-4">
//           <div className="h-px w-8 bg-[#00d4ff]" />
//           <span className="text-[10px] leading-3.75 text-[#00d4ff]">
//             WHAT PLAYERS SAY
//           </span>
//         </div>
//         <h2 className="mb-2 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-5xl font-extrabold text-transparent">
//           REVIEWS
//         </h2>
//         <p className="text-left text-base text-[#9a9a9a]">
//           Real feedback from real customers.
//         </p>
//       </div>

//       <div className="marquee-row">
//         <div className="marquee-track marquee-left">
//           {reviews.map((review, i) => (
//             <ReviewCard key={`${review.id}-${i}`} review={review} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

import { Card, CardContent } from "@/components/ui/card"
// import { FcGoogle } from "react-icons/fc"
import { Marquee } from "./ui/marquee"
import { Review } from "@/types"
import BorderBeamCornerCutCard from "@/app/components/neonblade-ui/border-beam-corner-cut-card"
// const reviews = [
//   {
//     name: "Ken Masters",
//     username: "@kmasters",
//     body: "“Our productivity has nearly doubled since onboarding. Automation features removed repetitive tasks, allowing our team to focus on building instead of managing operations.”",
//     profile: "https://images.shadcnspace.com/assets/profiles/rough.webp",
//   },
//   {
//     name: "Kira Athrun",
//     username: "@kathrun",
//     body: "“What surprised us most was how quickly our team adapted. Minimal learning curve, excellent documentation, and powerful features make it a must-have for modern SaaS companies.”",
//     profile: "https://images.shadcnspace.com/assets/profiles/albert.webp",
//   },
//   {
//     name: "Lirael Nassun",
//     username: "@lnassun",
//     body: "“This is easily one of the most reliable SaaS tools we’ve adopted. The UI is intuitive, integrations are seamless, and it saves us countless hours every week.”",
//     profile: "https://images.shadcnspace.com/assets/profiles/linda.webp",
//   },
//   {
//     name: "Jessica",
//     username: "@jessica",
//     body: "Switching to this platform streamlined our entire workflow. Setup was effortless, performance improved instantly, and our team now ships features faster without worrying about infrastructure.",
//     profile: "https://images.shadcnspace.com/assets/profiles/jessica.webp",
//   },
//   {
//     name: "Jenny",
//     username: "@jenny",
//     body: "“We evaluated multiple solutions, but this stood out immediately. It’s fast, scalable, and thoughtfully designed for growing teams that need stability without added complexity.”",
//     profile: "https://images.shadcnspace.com/assets/profiles/jenny.webp",
//   },
//   {
//     name: "Kira Athrun",
//     username: "@kathrun",
//     body: "“What surprised us most was how quickly our team adapted. Minimal learning curve, excellent documentation, and powerful features make it a must-have for modern SaaS companies.”",
//     profile: "https://images.shadcnspace.com/assets/profiles/albert.webp",
//   },
//   {
//     name: "Ken Masters",
//     username: "@kmasters",
//     body: "“Our productivity has nearly doubled since onboarding. Automation features removed repetitive tasks, allowing our team to focus on building instead of managing operations.”",
//     profile: "https://images.shadcnspace.com/assets/profiles/rough.webp",
//   },
// ]

const reviews: Review[] = [
  {
    id: "1",
    name: "Rohan Mehta",
    rating: 5,
    text: "Best gaming cafe in the city. The rigs are seriously high-end and the VR sets never lag.",
  },
  {
    id: "2",
    name: "dhanraj shetty",
    rating: 5,
    text: "Booked a PS5 station with friends, super smooth process and staff was helpful.",
  },
  {
    id: "3",
    name: "loki",
    rating: 5,
    text: "Best gaming cafe in the city. The rigs are seriously high-end and the VR sets never lag.",
  },
  {
    id: "4",
    name: "pranav timse",
    rating: 5,
    text: "Booked a PS5 station with friends, super smooth process and staff was helpful.",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

// const ReviewCard = ({
//   profile,
//   name,
//   username,
//   body,
// }: {
//   profile: string
//   name: string
//   username: string
//   body: string
// }) => {
//   return (
//     <Card className="relative h-full w-64 cursor-pointer overflow-hidden border-border bg-card p-4 shadow-none">
//       <CardContent className="flex flex-col gap-2 p-0">
//         <div className="flex flex-row items-center gap-2">
//           <img
//             className="rounded-full"
//             width="32"
//             height="32"
//             alt=""
//             src={profile}
//           />
//           <div className="flex flex-col">
//             <p className="text-sm font-medium text-foreground">{name}</p>
//             <p className="text-xs font-medium text-muted-foreground">
//               {username}
//             </p>
//           </div>
//         </div>
//         <p className="line-clamp-2 text-sm text-foreground">{body}</p>
//       </CardContent>
//     </Card>
//   )
// }

// function ReviewCard({ review }: { review: Review }) {
//   const initial = review.name.trim().charAt(0).toUpperCase()

//   return (
//     <BorderBeamCornerCutCard
//       className="w-[340px] shrink-0"
//       beamColor="cyan"
//       beamColorB="pink"
//       variant="gradient-sweep"
//       glowIntensity="low"
//       corner="bottom-right"
//       borderWidth={2}
//       size="md"
//       innerClassName="gap-4"
//     >
//       <div className="flex items-center gap-3">
//         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-lg font-bold text-cyan-400">
//           {initial}
//         </div>

//         <div className="min-w-0 flex-1">
//           <p className="truncate font-semibold text-white">{review.name}</p>

//           <StarRating rating={review.rating} />
//         </div>

//         <span className="text-xs text-white/40">via Google</span>
//       </div>

//       <p className="line-clamp-5 leading-7 text-white/60">{review.text}</p>
//     </BorderBeamCornerCutCard>
//   )
// }

function ReviewCard({ review }: { review: Review }) {
  const initial = review.name.trim().charAt(0).toUpperCase()

  return (
    <BorderBeamCornerCutCard
      className="max-w-[300px] shrink-0"
      beamColor="cyan"
      beamColorB="pink"
      variant="gradient-sweep"
      glowIntensity="low"
      corner="bottom-right"
      borderWidth={1}
      size="md"
      innerClassName="gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-lg font-bold text-cyan-400">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{review.name}</p>

          <StarRating rating={review.rating} />
        </div>

        <div className="flex items-center gap-1 text-xs text-white/40">
          {/* <FcGoogle /> */}
          <span>Google</span>
        </div>
      </div>

      <p className="line-clamp-5 text-sm leading-7 text-white/60">
        {review.text}
      </p>
    </BorderBeamCornerCutCard>
  )
}

export default function ReviewsSection() {
  return (
    <section className="min-h-screen overflow-hidden bg-black px-6 py-20">
      <div className="mx-auto mb-12 max-w-6xl">
        <div className="my-4 flex items-center gap-4">
          <div className="h-px w-8 bg-[#00d4ff]" />
          <span className="text-[10px] leading-3.75 text-[#00d4ff]">
            WHAT PLAYERS SAY
          </span>
        </div>
        <h2 className="mb-2 bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-5xl font-extrabold text-transparent">
          Testimonials
        </h2>
        <p className="text-left text-base text-[#9a9a9a]">
          Real feedback from real customers.
        </p>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:22s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="[--duration:22s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background"></div>
      </div>
    </section>
  )
}
