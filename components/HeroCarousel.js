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
      <div>
        <Image src="images/Banner1.png" alt="Slide 1" />
      </div>
      <div>
        <Image src="images/Banner2.png" alt="Slide 2" />
      </div>
      <div>
        <Image src="images/Banner3.png" alt="Slide 3" />
      </div>
    </Carousel>
  );
}
