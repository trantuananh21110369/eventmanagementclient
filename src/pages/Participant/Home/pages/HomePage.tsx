import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventListHome from "../components/EventListHome";
import { useGetHomeEventQuery } from "Apis/searchApis";

const HomePage = () => {
  const { data, isFetching } = useGetHomeEventQuery({ searchString: "", fromDate: "", toDate: "" });
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
  const [sliderEvents, setSliderEvents] = useState([]);  // Dành cho các sự kiện trong slider

  useEffect(() => {
    if (data) {
      const firstThreeEvents = data?.result?.slice(0, 3);
      setHomeEvent(data?.result); // Cập nhật tất cả các sự kiện cho phần list
      setSliderEvents(firstThreeEvents); // Cập nhật chỉ 3 sự kiện đầu tiên cho slider
      console.log(data?.result?.slice(0, 3));
    }
  }, [data]);

  return (
    <div className="p-6 flex flex-col items-center h-auto w-full">
      {/* Top Banner Section (Slider) */}
      <div className="w-3/4 mb-8">
        <Slider {...settings}>
          {sliderEvents.map((event: any, index) => (
            <div key={index} className="relative">
              <img
                src={event?.urlImage || "https://placehold.co/600x400"}  // Giả sử sự kiện có trường imageUrl
                alt={event?.eventName || "Event image"}  // Giả sử sự kiện có trường name
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          ))}
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
