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
    dots: false,
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
      setHomeEvent(data.result);
      setSliderEvents(firstThreeEvents); // Cập nhật chỉ 3 sự kiện đầu tiên cho slider
    }
  }, [data]);

  return (
    <div className="p-6 flex flex-col items-center h-auto w-full">
      {/* Top Banner Section (Slider) */}
      <div className="w-3/4 mb-8">
        <Slider {...settings}>
          {sliderEvents.map((event: any, index) => (
            <div key={index} className="relative p-4">
              <div className="w-[900px] h-[250px] bg-gray-300 overflow-hidden rounded-lg shadow-md mx-auto">
                <img
                  src={event?.urlImage || "https://placehold.co/600x400"}
                  alt={event?.eventName || "Event image"}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Event Listings */}
      <EventListHome data={homeEvent} isFetching={isFetching} />
    </div>
  );
};

export default HomePage;
