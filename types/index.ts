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

export type Extension = {
  id: string;
  booking_id: string;
  amount: number;
  payment_status: 'pending' | 'paid';
};

export interface BookingRow {
  id: string;

  user_id: string | null;

  customer_name: string | null;
  customer_phone: string | null;

  station_id: string;
  device: 'pc' | 'ps5' | 'vr' | 'racing';
  tier: 'single' | 'multiplayer' | null;

  date: string;
  start_time: string;

  duration_hours: number | null;
  duration: number | null;

  players: number;

  amount: number;

  payment_method: 'cash' | 'upi_manual' | 'razorpay' | 'complimentary' | null;

  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';

  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';

  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;

  session_started_at: string | null;
  session_ended_at: string | null;

  created_at: string;

  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export type DueCheckBooking = {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  session_started_at: string | null;
  date: string;
  start_time: string;
};

export type DueSessionBooking = {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  session_started_at: string | null;
  date: string;
  start_time: string;
  customer_name: string | null;
};

export type PaymentMethod =
  'cash' | 'upi_manual' | 'razorpay' | 'complimentary';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type UserRole = 'owner' | 'staff' | 'customer';

export interface CustomerRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  booking_count: number;
}

// Games section types
export type GameCategory = 'all' | 'ps5' | 'pc' | 'vr' | 'racing';

export interface GameInput {
  title: string;
  category: GameCategory;
  image_url: string;
  tags: string[];
  featured: boolean;
}

export interface GameRow {
  id: string;
  title: string;
  category: Exclude<GameCategory, 'all'>;
  image_url: string;
  tags: string[];
  featured: boolean;
  display_order: number;
  created_at: string;
}

export const CATEGORIES: { value: GameCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ps5', label: 'PS5' },
  { value: 'pc', label: 'PC' },
  { value: 'racing', label: 'Racing' },
  { value: 'vr', label: 'VR' },
];

// station types
export type StationType = 'pc' | 'ps5' | 'racing' | 'vr';
export type BookingStatus = 'free' | 'booked';
export type OperationalStatus =
  'active' | 'maintenance' | 'offline' | 'retired';

export interface PcSpecs {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
}

export interface StationRow {
  id: string;
  type: StationType;
  name: string;
  specs: PcSpecs | null;
  hourly_rate: number;
  cafe_location: string;
  status: BookingStatus;
  operational_status: OperationalStatus;
  admin_note: string | null;
  max_players: number;
  display_order: number;
  created_at: string;
}
