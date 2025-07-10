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
        <img src="https://placehold.co/1200x500?text=New+Chaniya+Cholis+Launched" alt="Slide 2" />
      </div>
      <div>
        <img src="https://placehold.co/1200x500?text=Men's+Kurta+Collection" alt="Slide 3" />
      </div>
    </Carousel>
  );
}
