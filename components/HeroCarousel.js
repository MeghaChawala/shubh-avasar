// components/HeroCarousel.js
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';

const slides = [
  {
    desktop: '/images/Banner1.png',        // 1366x768 ~16:9
    mobile: '/images/Banner1-mobile.png',  // 1080x599 ~16:9
    alt: 'Slide 1',
  },
  {
    desktop: '/images/Banner2.png',
    mobile: '/images/Banner2-mobile.png',
    alt: 'Slide 2',
  },
  {
    desktop: '/images/Banner3.png',
    mobile: '/images/Banner3-mobile.png',
    alt: 'Slide 3',
  },
];

export default function HeroCarousel() {
  // Mobile aspect ratio for your images
  const mobileAspectRatio = 599 / 1080; // ~0.555

  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={4000}
      className="z-10"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className="relative w-full sm:h-[80vh] lg:h-screen bg-black"
          style={{
            // For mobile: dynamic height based on viewport width and aspect ratio
            height: `calc(100vw * ${mobileAspectRatio})`,
          }}
        >
          {/* Mobile Image */}
          <div className="sm:hidden">
            <Image
              src={slide.mobile}
              alt={slide.alt}
              fill
              className="object-contain"
              priority={i === 0}
              sizes="100vw"
            />
          </div>

          {/* Desktop Image */}
          <div className="hidden sm:block">
            <Image
              src={slide.desktop}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(min-width: 640px) 100vw"
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
