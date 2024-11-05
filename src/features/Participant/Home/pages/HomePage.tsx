import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventListHome from "../components/EventListHome";
import { useGetHomeEventQuery } from "Apis/searchApis";


const HomePage = () => {
  const { data, isFetching } = useGetHomeEventQuery(null);
  console.log(data, isFetching);
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

  const [homeEvent, setHomeEvent] = useState([]);
  useEffect(() => {
    if (data) {
      setHomeEvent(data?.result);
    }
  }, [data])

  return (
    <div className="p-6 flex flex-col items-center h-auto w-full">
      {/* Top Banner Section (Slider) */}
      <div className="w-3/4 mb-8">
        <Slider {...settings}>
          <div className="relative">
            <img
              src="https://placehold.co/600x400"
              alt="Dracula Drag Shows"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img
              src="https://placehold.co/600x400"
              alt="Boo-it-yourself Decorations"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="relative">
            <img
              src="https://placehold.co/600x400"
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
      <EventListHome data={homeEvent} isFetching={isFetching} />
    </div>
  );
};

export default HomePage;