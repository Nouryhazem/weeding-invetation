export interface ImageManifestEntry {
  id: string;
  name: string;
  recommendedSize: string;
  recommendedAspect: string;
  description: string;
  defaultPosition: string;
  path: string;
}

export const imageManifest: Record<string, ImageManifestEntry> = {
  hero: {
    id: "hero",
    name: "صورة الغلاف السينمائي (Hero)",
    recommendedSize: "1920x1080px (أو 2560x1440px)",
    recommendedAspect: "16:9 (أفقي سينمائي)",
    description: "صورة سينمائية للعروسين بألوان دافئة ومدروسة",
    defaultPosition: "center 30%",
    path: "/images/hero.webp"
  },
  portraitAhmed: {
    id: "portraitAhmed",
    name: "بورتريه أحمد (Groom Portrait)",
    recommendedSize: "1200x1600px",
    recommendedAspect: "3:4 (رأسي بورتريه)",
    description: "صورة بورتريه أنيقة للعريس بخلفية هادئة",
    defaultPosition: "center 20%",
    path: "/images/ahmed.webp"
  },
  portraitNoor: {
    id: "portraitNoor",
    name: "بورتريه نور (Bride Portrait)",
    recommendedSize: "1200x1600px",
    recommendedAspect: "3:4 (رأسي بورتريه)",
    description: "صورة بورتريه أنيقة للعروس بفستان زفاف ناعم",
    defaultPosition: "center 20%",
    path: "/images/noor.webp"
  },
  venue: {
    id: "venue",
    name: "صورة قاعة الفرح (Venue)",
    recommendedSize: "1920x1080px",
    recommendedAspect: "16:9 (أفقي معماري مونوكروم)",
    description: "لقطة معمارية أنيقة بالأبيض والأسود للقاعة",
    defaultPosition: "center center",
    path: "/images/venue.webp"
  },
  closing: {
    id: "closing",
    name: "صورة الختام (Closing Portrait)",
    recommendedSize: "1920x1200px",
    recommendedAspect: "16:10 / 16:9",
    description: "صورة ختامية عاطفية للعروسين",
    defaultPosition: "center 35%",
    path: "/images/closing.webp"
  },
  journey1: {
    id: "journey1",
    name: "رحلة الصور ١ - بداية الحكاية",
    recommendedSize: "1400x1050px",
    recommendedAspect: "4:3 / 16:9",
    description: "صورة عفوية دافئة للعروسين",
    defaultPosition: "center center",
    path: "/images/journey_1.webp"
  },
  journey2: {
    id: "journey2",
    name: "رحلة الصور ٢ - أحلى صدفة",
    recommendedSize: "1400x1050px",
    recommendedAspect: "4:3 / 16:9",
    description: "صورة تبرز ملامح الفرحة المشتركة",
    defaultPosition: "center top",
    path: "/images/journey_2.webp"
  },
  journey3: {
    id: "journey3",
    name: "رحلة الصور ٣ - ومن هنا بدأت خطوتنا الجديدة",
    recommendedSize: "1400x1050px",
    recommendedAspect: "4:3 / 16:9",
    description: "صورة الخطوبة أو عهد المحبة",
    defaultPosition: "center center",
    path: "/images/journey_3.webp"
  },
  journey4: {
    id: "journey4",
    name: "رحلة الصور ٤ - والخطوة الجاية معاكم",
    recommendedSize: "1400x1050px",
    recommendedAspect: "4:3 / 16:9",
    description: "صورة التجهيزات والترقب لليلة الزفاف",
    defaultPosition: "center bottom",
    path: "/images/journey_4.webp"
  }
};

/**
 * Preload an image URL returning a promise that resolves with success status
 */
export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(false);
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}
