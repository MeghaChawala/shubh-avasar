// components/HeroCarousel.js
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';

const slides = [
  {
    desktop: '/images/Banner1.png',
    mobile: '/images/Banner1-mobile.png',
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
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={4000}
      className="z-10"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className="relative w-full h-[60vh] sm:h-[80vh] lg:h-screen bg-black"
        >
          {/* Mobile Image */}
          <div className="sm:hidden">
            <Image
              src={slide.mobile}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>

          {/* Desktop Image */}
          <div className="hidden sm:block">
            <Image
              src={slide.desktop}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
