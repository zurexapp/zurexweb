// BannerCarousel.js

import React from 'react';
import { Carousel } from 'react-bootstrap'; // Adjust import as per your carousel library
import banner1 from '../assets/banner1.png'; // Adjust paths as per your actual banner images
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';

const BannerCarousel = ({ clientBanners }) => {
  return (
    <Carousel
      variant="dark"
      className="my-4 crouselCustomClass"
      fade
      controls={false}
      interval={4500}
    >
      {clientBanners ? (
        clientBanners.map((dat, index) => (
          <Carousel.Item key={index}>
            <img
              style={{ width: "100%", objectFit: "contain" }}
              src={dat.imgLink}
              alt={`banner${index}`}
            />
          </Carousel.Item>
        ))
      ) : (
        <>
          <Carousel.Item>
            <img
              style={{ width: "100%", objectFit: "contain" }}
              src={banner1}
              alt="banner1"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              style={{ width: "100%", objectFit: "contain" }}
              src={banner2}
              alt="banner2"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              style={{ width: "100%", objectFit: "contain" }}
              src={banner3}
              alt="banner3"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              style={{ width: "100%", objectFit: "contain" }}
              src={banner4}
              alt="banner4"
            />
          </Carousel.Item>
        </>
      )}
    </Carousel>
  );
};

export default BannerCarousel;
