import { WeddingData } from '../types';
import coupleImg from '../assets/Couple.png';
import heroImg from '../assets/hero.PNG';

export const weddingData: WeddingData = {
  brideArabic: "نور",
  groomArabic: "أحمد",
  brideEnglish: "Noor",
  groomEnglish: "Ahmed",
  date: "2026-09-08",
  time: "20:00",
  timezone: "Africa/Cairo",
  venueName: "Lovely Hall",
  venueAddress: "قاعة لوفلي - القاهرة",
  mapsUrl: "https://maps.google.com/?q=Lovely+Hall",
  calendarUrl: "",
  heroImage: heroImg || coupleImg,
  portraitAhmed: coupleImg,
  portraitNoor: coupleImg,
  venueImage: "/images/venue.webp",
  closingImage: coupleImg,
  showPortraitQuotes: true,
  ahmedQuote: "أجمل ما في العمر أن أبدأ معكِ حكايتنا الأبدية",
  noorQuote: "وبك تكتمل كل أمنياتي وفرحتي الكبرى",
  journeyImages: [
    {
      id: "j1",
      src: coupleImg,
      caption: "بداية الحكاية",
      subtitle: "حيث التقت القلوب وبدأ عهد المحبة",
      objectPosition: "center top",
      recommendedAspect: "3:4"
    },
    {
      id: "j2",
      src: coupleImg,
      caption: "وعد بالبقاء",
      subtitle: "يداً بيد نحو كل ما هو قادم وجميل",
      objectPosition: "center center",
      recommendedAspect: "3:4"
    },
    {
      id: "j3",
      src: coupleImg,
      caption: "فرحة العمر",
      subtitle: "لحظات نخلدها بحب يدوم مدى الأيام",
      objectPosition: "center center",
      recommendedAspect: "3:4"
    },
    {
      id: "j4",
      src: coupleImg,
      caption: "والفرحة تكتمل بكم",
      subtitle: "ليلتنا المنتظرة تزهو بحضوركم الغالي",
      objectPosition: "center center",
      recommendedAspect: "3:4"
    }
  ]
};
