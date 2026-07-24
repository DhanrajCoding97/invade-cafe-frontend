export interface Service {
  id: string;
  title: string;
  color: 'cyan' | 'teal' | 'pink' | 'purple' | 'amber';
  imageSrc: string;
  imageAlt: string;
  features: string[];
}

export const services: Service[] = [
  {
    id: 'pc-gaming',
    title: 'PC Gaming',
    color: 'cyan',
    imageSrc: '/images/pc.webp',
    imageAlt: 'High-end PC gaming station with dual monitor setup',
    features: [
      'High-End Rigs',
      '144Hz+ Displays',
      'Epic Game Library',
      'Mechanical Keyboards',
    ],
  },
  {
    id: 'ps5',
    title: 'PS5',
    color: 'pink',
    imageSrc: '/images/ps5.webp',
    imageAlt: 'PS5 console and controller setup with 4K display',
    features: [
      'Latest Titles',
      '4K Displays',
      'Rental Available',
      'Multiplayer Ready',
    ],
  },
  {
    id: 'vr',
    title: 'VR',
    color: 'teal',
    imageSrc: '/images/vr.webp',
    imageAlt: 'VR headset and motion controllers ready for use',
    features: [
      'Full-Motion Tracking',
      'Immersive Titles',
      'Multiplayer VR',
      'Sanitized Headsets',
    ],
  },
  {
    id: 'sim-racing',
    title: 'Sim Racing',
    color: 'amber',
    imageSrc: '/images/racingsim.webp',
    imageAlt: 'Sim racing rig with wheel, pedals, and racing seat',
    features: [
      'Wheel & Pedal Setup',
      'Racing Seat Rigs',
      'Top Racing Titles',
      'Leaderboards',
    ],
  },
];

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export interface Station {
  id: string;
  name: string;
  type: string;
  hourly_rate: number;
  status: string;
}

// bookings table types
export interface BookingRow {
  id: string;

  customer_name: string | null;
  customer_phone: string | null;

  station_id: string;
  device: 'pc' | 'ps5' | 'psvr' | 'racing';

  date: string;
  start_time: string;

  duration_hours: number | null;
  duration: number | null;

  players: number;

  amount: number;

  payment_method: 'cash' | 'upi_manual' | 'razorpay' | 'complimentary' | null;

  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';

  status: 'confirmed' | 'completed' | 'cancelled';

  session_started_at: string | null;
  session_ended_at: string | null;

  created_at: string;
}
