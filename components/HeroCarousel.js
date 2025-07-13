// components/HeroCarousel.js
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
        <img src="images/HB-banner_Desktop-min_19.webp" alt="Slide 1" />
      </div>
      <div>
        <img src="images/c2.jpeg" alt="Slide 2" />
      </div>
      <div>
        <img src="images/c4.png" alt="Slide 3" />
      </div>
    </Carousel>
  );
}
