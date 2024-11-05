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
    <div className="w-full flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Our top picks for you</h2>
      <div className="flex flex-wrap items-center justify-center space-x-3 my-3">
        {data.map((item, index) => (
          <Link to={`/e/${item.eventId}`} >
            <div key={index} className="flex flex-col basis-1/9 mb-4">
              <input type="hidden" id={item?.eventId} name="custId" />
              <img
                src={item?.urlImage}
                className="w-96 h-64 rounded-lg mb-2 object-cover"
              />
              <h3 className="text-lg font-semibold">{item?.eventName}</h3>
              <p className='text-sm'> {item.location} </p>
              <p className="text-sm text-green-800">{item.priceLow}$ - {item.priceHigh}$</p>
            </div>
          </Link>
        ))}
      </div>
    </div >
  );
}

export default EventListHome
