import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

let banner1 = require("../../Asset/banner-1.png");
let banner2 = require("../../Asset/banner-2.png");
let banner3 = require("../../Asset/banner-3.png");

const HomePage = () => {
  // Cấu hình cho react-slick slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="p-6 flex flex-col items-center h-auto w-full">
      {/* Top Banner Section (Slider) */}
      <div className="w-3/4 mb-8">
        <Slider {...settings}>
          <div className="relative">
            <img
              src={banner1}
              alt="Dracula Drag Shows"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img
              src={banner2}
              alt="Boo-it-yourself Decorations"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img
              src={banner3}
              alt="Kooky or Spooky"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </Slider>
      </div>

      {/* Category Icons */}
      <div className="flex flex-col space-y-4 mb-8 w-3/4">
        <div className="flex justify-around space-x-2">
        <div className="text-center hover:text-yellow-500 cursor-pointer">
            <span className="text-4xl border border-5 rounded-full transition-colors hover:border-yellow-500">🎤</span>
            <p className="mt-2 text-sm hover:text-yellow-500">Music</p>
        </div>
        <div className="text-center hover:text-yellow-500 cursor-pointer">
            <span className="text-4xl border border-5 rounded-full transition-colors hover:border-yellow-500">🌃</span>
            <p className="mt-2 text-sm hover:text-yellow-500">Nightlife</p>
          </div>
          <div className="text-center hover:text-yellow-500 cursor-pointer">
          <span className="text-4xl border border-5 rounded-full transition-colors hover:border-yellow-500">🎭</span>
            <p className="mt-2 text-sm hover:text-yellow-500">Performing & Visual Arts</p>
          </div>
          <div className="text-center hover:text-yellow-500 cursor-pointer">
          <span className="text-4xl border border-5 rounded-full transition-colors hover:border-yellow-500">🎃</span>
            <p className="mt-2 text-sm hover:text-yellow-500">Halloween</p>
          </div>
          <div className="text-center hover:text-yellow-500 cursor-pointer">
          <span className="text-4xl border border-5 rounded-full transition-colors hover:border-yellow-500">💘</span>
            <p className="mt-2 text-sm hover:text-yellow-500">Dating</p>
          </div>
        </div>
      </div>

      {/* Event Listings */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Our top picks for you</h2>
        <div className="flex flex-row space-y-4 w-full md:w-3/4 lg:w-1/2">
          <div className="w-full text-center">
            <img
              src="event1.jpg"
              alt="DreamBank Dream Summit"
              className="w-full h-auto rounded-lg mb-2"
            />
            <h3 className="text-lg font-semibold">DreamBank Dream Summit</h3>
            <p className="text-sm">Thu, Nov 21 - 10:00 PM GMT+7</p>
          </div>
          <div className="w-full text-center">
            <img
              src="event2.jpg"
              alt="USA Real Estate Forum 2024"
              className="w-full h-auto rounded-lg mb-2"
            />
            <h3 className="text-lg font-semibold">USA Real Estate Forum 2024</h3>
            <p className="text-sm">Sat, Nov 30 - 10:00 AM</p>
          </div>
          <div className="w-full text-center">
            <img
              src="event3.jpg"
              alt="Riverstone Corporate Training"
              className="w-full h-auto rounded-lg mb-2"
            />
            <h3 className="text-lg font-semibold">Riverstone Corporate Training</h3>
            <p className="text-sm">Wed, Jan 15 - 9:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
