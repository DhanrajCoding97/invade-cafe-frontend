"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const bookingSchema = z.object({
  device: z.enum(["pc", "ps5", "psvr", "racing"]),
  stationId: z.string().min(1, "Select a station"),
  date: z.date(),
  startTime: z.string().min(1, "Select a start time"),
  duration: z.number().min(1),
  players: z.number().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

//order matters - index = step number

const STEPS = [
  "device",
  "station",
  "datetime",
  "duration",
  "summary",
  "login",
  "payment",
  "confirmed",
] as const

type Step = (typeof STEPS)[number]

// Fields validated per step before "Next" is allowed

const STEP_FIELDS: Partial<Record<Step, (keyof BookingFormValues)[]>> = {
  device: ["device"],
  station: ["stationId"],
  datetime: ["date", "startTime"],
  duration: ["duration"],
}

interface BookkingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
