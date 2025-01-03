import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventListHome from "../components/EventListHome";
import { useGetHomeEventQuery } from "Apis/searchApis";
import FullScreenLoader from "Components/UI/Loading";
import { PagingBar } from "Components/UI";
import { useSearchParams } from "react-router-dom";
let backgroundchrist = require("Assets/images/backgroundchrist.jpg");

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fromDate, setFromDate] = useState("");  // Ngày bắt đầu
  const [toDate, setToDate] = useState("");      // Ngày kết thúc

  // Truyền fromDate và toDate vào hook useGetHomeEventQuery
  const { data, isFetching } = useGetHomeEventQuery({ searchString: "", fromDate, toDate, pageSize, pageNumber });

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
      const firstThreeEvents = data?.apiResponse?.result?.slice(0, 3);
      setHomeEvent(data?.apiResponse?.result);
      const { TotalRecords } = JSON.parse(data?.totalRecords || "{}");
      setTotalRecords(TotalRecords);
      setSliderEvents(firstThreeEvents); // Cập nhật chỉ 3 sự kiện đầu tiên cho slider
    }
  }, [data]);

  if (isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <div className="p-6 flex flex-col items-center h-auto w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundchrist})` }}>
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

        {/* Filter Section */}
        <div className="flex justify-start gap-8 mt-6">
          <div className="text-center">
            <label htmlFor="fromDate" className="text-lg font-semibold text-white block mb-2">From Date:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-2 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-center">
            <label htmlFor="toDate" className="text-lg font-semibold text-white block mb-2">To Date:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border-2 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Event Listings */}
      <EventListHome data={homeEvent} isFetching={isFetching} />

      <PagingBar
        totalRecords={totalRecords}
      />
    </div>
  );
};

export default HomePage;
