'use client';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import gsap from 'gsap';
import 'swiper/css/effect-coverflow';

import 'swiper/css';
import 'swiper/css/pagination';

import './custom-swiper.css';
const images = [
  { src: '/gallery1.webp', title: 'gallery 1' },
  { src: '/gallery2.webp', title: 'gallery 2' },
  { src: '/gallery3.webp', title: 'gallery 3' },
  { src: '/gallery4.webp', title: 'gallery 4' },
  { src: '/gallery5.webp', title: 'gallery 5' },
  { src: '/gallery6.webp', title: 'gallery 6' },
];

export default function GallerySlider() {
  const swiperWrapperRef = useRef<HTMLElement | null>(null);

  function adjustMargin() {
    const screenWidth = window.innerWidth;

    if (swiperWrapperRef.current) {
      swiperWrapperRef.current.style.marginLeft =
        screenWidth <= 600 ? '-75px' : screenWidth <= 900 ? '-90px' : '-150px';
    }
  }
  return (
    // <Swiper
    //   modules={[Pagination, Mousewheel]}
    //   slidesPerView={1.2}

    //   spaceBetween={20}
    //   centeredSlides
    //   pagination={{ clickable: true }}
    //   mousewheel
    //   breakpoints={{
    //     768: {
    //       slidesPerView: 2.2,
    //     },
    //     1024: {
    //       slidesPerView: 3,
    //     },
    //   }}
    // >
    //   {images.map((src) => (
    //     <SwiperSlide key={src}>
    //       <Image
    //         src={src}
    //         alt=""
    //         width={600}
    //         height={400}
    //         className="rounded-xl"
    //       />
    //     </SwiperSlide>
    //   ))}
    // </Swiper>
    <div className='flex flex-col items-center justify-center'>
      <Swiper
        modules={[Mousewheel, Pagination]}
        grabCursor={true}
        // loop={true}
        initialSlide={4}
        centeredSlides={true}
        slidesPerView='auto'
        spaceBetween={10}
        speed={1000}
        slideToClickedSlide={true}
        pagination={{ clickable: true }}
        mousewheel={{ thresholdDelta: 30 }}
        onSwiper={(swiper) => {
          swiperWrapperRef.current = swiper.wrapperEl;
          swiper.on('resize', adjustMargin);
        }}
        onSlideChange={(swiper) => {
          const activeSlide = swiper.slides[swiper.activeIndex];
          gsap.fromTo(
            activeSlide,
            { scale: 0.08 },
            { scale: 1, duration: 1, ease: 'back.inOut' },
          );
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image.src} alt={image.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
