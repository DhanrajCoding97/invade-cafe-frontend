export interface Service {
  id: string
  title: string
  color: "cyan" | "teal" | "pink" | "purple" | "amber"
  imageSrc: string
  imageAlt: string
  features: string[]
}

export const services: Service[] = [
  {
    id: "pc-gaming",
    title: "PC Gaming",
    color: "cyan",
    imageSrc: "/pc.jpg",
    imageAlt: "High-end PC gaming station with dual monitor setup",
    features: [
      "High-End Rigs",
      "144Hz+ Displays",
      "Epic Game Library",
      "Mechanical Keyboards",
    ],
  },
  {
    id: "ps5",
    title: "PS5",
    color: "pink",
    imageSrc: "/ps5.jpg",
    imageAlt: "PS5 console and controller setup with 4K display",
    features: [
      "Latest Titles",
      "4K Displays",
      "Rental Available",
      "Multiplayer Ready",
    ],
  },
  {
    id: "vr",
    title: "VR",
    color: "teal",
    imageSrc: "/vr.jpg",
    imageAlt: "VR headset and motion controllers ready for use",
    features: [
      "Full-Motion Tracking",
      "Immersive Titles",
      "Multiplayer VR",
      "Sanitized Headsets",
    ],
  },
  {
    id: "sim-racing",
    title: "Sim Racing",
    color: "amber",
    imageSrc: "/racingsim.jpg",
    imageAlt: "Sim racing rig with wheel, pedals, and racing seat",
    features: [
      "Wheel & Pedal Setup",
      "Racing Seat Rigs",
      "Top Racing Titles",
      "Leaderboards",
    ],
  },
]

export interface Review {
  id: string
  name: string
  rating: number
  text: string
}
