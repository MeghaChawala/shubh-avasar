// components/HeroCarousel.js
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';

export default function HeroCarousel() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={4000}
      className="z-10"
    >
      {['Banner1.png', 'Banner2.png', 'Banner3.png'].map((img, i) => (
        <div
          key={i}
          className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen"
        >
          <Image
            src={`/images/${img}`}
            alt={`Slide ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0} // Optional: prioritize first image for better LCP
          />
        </div>
      ))}
    </Carousel>
  );
}
