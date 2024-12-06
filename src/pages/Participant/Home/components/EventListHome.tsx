import React from 'react';
import { Link } from 'react-router-dom';

interface EventHome {
  eventId: string;
  eventName: string;
  urlImage: string;
  location: string;
  priceLow: number;
  priceHigh: number;
}

interface EventListHomeProps {
  data: EventHome[];
  isFetching: boolean;
}

function EventListHome({ data, isFetching }: EventListHomeProps) {

  if (isFetching) {
    return <div className="text-center text-xl text-gray-700">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center px-5">
      <h2 className="text-3xl font-bold text-primary-800 mb-6 text-center">Our Top Picks for You</h2>
      <div
        className="grid gap-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {data.map((item, index) => (
          <Link to={`/e/${item.eventId}`} key={index} className="group transition-transform transform hover:scale-105">
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Hình ảnh với chiều cao cố định */}
              <div className="flex-shrink-0">
                <img
                  src={item?.urlImage || "https://placehold.co/300x200"}
                  alt={item?.eventName}
                  className="w-full h-[200px] object-cover mb-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Nội dung sự kiện */}
              <div className="flex flex-col items-center w-full p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{item?.eventName}</h3>
                <p className="text-sm text-gray-500 text-center mb-2">{item.location}</p>
                <p className="text-sm font-semibold text-green-600 text-center">
                  {item.priceLow}$ - {item.priceHigh}$
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EventListHome;
