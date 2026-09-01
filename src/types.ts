export interface JourneyImageItem {
  id: string;
  src: string;
  caption: string;
  subtitle?: string;
  objectPosition?: string;
  recommendedAspect?: string;
}

export interface WeddingData {
  brideArabic: string;
  groomArabic: string;
  brideEnglish: string;
  groomEnglish: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  timezone: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  calendarUrl: string;
  heroImage: string;
  portraitAhmed: string;
  portraitNoor: string;
  venueImage: string;
  closingImage: string;
  showPortraitQuotes: boolean;
  ahmedQuote?: string;
  noorQuote?: string;
  journeyImages: JourneyImageItem[];
}

export interface GuestMessageEntry {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  approved?: boolean;
}
