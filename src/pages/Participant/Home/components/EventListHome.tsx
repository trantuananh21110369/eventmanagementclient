import React from 'react'
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
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center px-5">
      <h2 className="text-2xl font-bold text-primary-800 mb-6">Our Top Picks for You</h2>
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {data.map((item, index) => (
          <Link to={`/e/${item.eventId}`} key={index} className="group">
            <div className="flex flex-col items-center bg-gray-200 shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <input type="hidden" id={item?.eventId} name="custId" />
              {/* Hình ảnh với chiều cao cố định */}
              <div className="flex-shrink-0">
                <img
                  src={item?.urlImage || "https://placehold.co/300x200"}
                  alt={item?.eventName}
                  className="w-full h-[200px] rounded-lg object-cover mb-3 group-hover:opacity-90 transition-opacity"
                />
              </div>
              {/* Nội dung sự kiện */}
              <div className="flex flex-col items-center w-full p-4 h-[200px]"> {/* Thiết lập chiều cao cố định cho div nội dung */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item?.eventName}</h3>
                <p className="text-sm text-gray-600">{item.location}</p>
                <p className="text-sm font-semibold text-green-600">
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

export default EventListHome
