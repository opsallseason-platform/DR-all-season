/**
 * SHARED TYPESCRIPT TYPES
 * 
 * Purpose: Define types for all data structures used across the app
 */

// Service/Tour/Excursion type
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'tour' | 'excursion' | 'transfer';
  price: number; // Adult price (for backward compatibility)
  adultPrice?: number; // Explicit adult price
  childPrice?: number; // Child price (up to 12 years old)
  isPerPerson?: boolean; // Whether price is multiplied by passenger count
  childPriceEnabled?: boolean; // Whether child pricing is available for this service
  hasOpenBar?: boolean; // Whether service includes open bar
  originalPrice?: number; // Shown as strikethrough when there's a promo
  pricingPackages?: PricingPackage[]; // Multiple pricing options (e.g. dolphins)
  extraPersonPrice?: number; // Extra cost per person beyond base capacity (transfers)
  duration: string;
  image: string;
  featured: boolean;
}

// Pricing package for services with multiple options
export interface PricingPackage {
  label: string;
  adultPrice: number;
  childPrice?: number;
}

// Testimonial type
export interface Testimonial {
  id: string;
  name: string;
  country: string;
  rating: number;
  comment: string;
  avatar?: string;
}

// Benefit/Feature type
export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Pricing tier for group sizes
export interface PricingInfo {
  basePrice: number;
  basePassengers: number; // Max passengers for base price
  extraPersonPrice?: number; // Price per extra person
  note?: string;
}

// Booking types
export interface Booking {
  id: string;
  bookingReference: string;
  serviceId: string;
  customerId: string;
  serviceDate: Date;
  serviceTime: string;
  numPassengers: number;
  pricePerPerson: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  customerEmail: string;
  customerPhone?: string;
  customerFirstName: string;
  customerLastName: string;
  customerHotel?: string;
  language: string;
  specialRequests?: string;
  assignedDriverGuide?: string;
  internalNotes?: string;
  inventoryLockedUntil?: Date;
  createdAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
}

export interface CreateBookingRequest {
  serviceId: string;
  serviceDate: string; // ISO date string
  serviceTime: string;
  numPassengers: number;
  customerEmail: string;
  customerPhone?: string;
  customerFirstName: string;
  customerLastName: string;
  customerHotel?: string;
  specialRequests?: string;
  flightNumber?: string;
  airline?: string;
  language?: string;
  paymentMethodId?: string;
  companyName?: string; // Honeypot field for spam prevention
}

export interface BookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
  bookingReference?: string;
}

export interface AvailabilityCheck {
  serviceId: string;
  date: string; // ISO date string
  available: boolean;
  availableTimes?: string[];
  maxCapacity?: number;
  bookedCount?: number;
  reason?: string;
  error?: string;
}

// Pricing calculation
export interface PricingCalculation {
  basePrice: number;
  numPassengers: number;
  pricePerPerson: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  pricingTiersApplied: string[];
}

// Customer type
export interface Customer {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  country: string;
  preferredLanguage: string;
  hotelName?: string;
  tags: string[];
  notes?: string;
  totalBookings: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}