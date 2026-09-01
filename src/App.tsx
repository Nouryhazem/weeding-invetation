import { useState } from 'react';
import { weddingData } from './data/weddingData';
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';
import { FloatingFlowers } from './components/FloatingFlowers';
import { Hero } from './components/Hero';
import { AnimatedDate } from './components/AnimatedDate';
import { Countdown } from './components/Countdown';
import { PhotoJourney } from './components/PhotoJourney';
import { EventDetails } from './components/EventDetails';
import { LocationSection } from './components/LocationSection';
import { GuestMessage } from './components/GuestMessage';
import { ClosingSection } from './components/ClosingSection';

export default function App() {
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#F4EEE7] text-[#463F3A] overflow-x-hidden selection:bg-[#DECBC7]/35 selection:text-[#463F3A] font-light">
      <ScrollProgress />
      <FloatingFlowers />

      {/* 1. Preloader */}
      <Preloader
        data={weddingData}
        onComplete={() => setPreloaderFinished(true)}
      />

      <main className="relative w-full">
        {/* 2. Hero */}
        <Hero
          data={weddingData}
          preloaderFinished={preloaderFinished}
        />

        {/* 3. Countdown (Positioned between Hero and Save the Date, styled after reference) */}
        <Countdown data={weddingData} />

        {/* 4. Animated Date (Save the Date + ICS calendar) */}
        <AnimatedDate data={weddingData} />

        {/* 5. Photo Journey */}
        <PhotoJourney data={weddingData} />

        {/* 7. Event Details */}
        <EventDetails data={weddingData} />

        {/* 8. Location */}
        <LocationSection data={weddingData} />

        {/* 9. Guest Message */}
        <GuestMessage data={weddingData} />

        {/* 10. Closing Section */}
        <ClosingSection data={weddingData} />
      </main>
    </div>
  );
}


