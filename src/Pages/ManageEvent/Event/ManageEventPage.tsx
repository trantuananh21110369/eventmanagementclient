import React, { useState } from 'react';
import dayjs from 'dayjs';
import { NavLink } from 'react-router-dom';

function ManageEventPage() {
  const [selectedFilter, setSelectedFilter] = useState('Upcoming Events');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [hoveredDay, setHoveredDay] = useState<dayjs.Dayjs | null>(null);

  const startDay = currentMonth.startOf('month').startOf('week');
  const endDay = currentMonth.endOf('month').endOf('week');

  const filters = ['Upcoming Events', 'Draft', 'Past Events', 'All Events'];

  const days = [];
  let day = startDay;
  while (day.isBefore(endDay)) {
    days.push(day);
    day = day.add(1, 'day');
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handleCreateEvent = (day: dayjs.Dayjs) => {
    console.log(`Creating event on ${day.format('YYYY-MM-DD')}`);
    // Thêm logic để tạo sự kiện ở đây
  };

  return (
    <div className="p-6 z-1">
      <header className="mb-6">
        <h1 className="text-4xl font-bold">Events</h1>
        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
          <p>
            We’ll be performing routine site maintenance starting at 12:15 AM PDT on Monday October 21. We expect this to take 15 minutes, and eventbrite.com will be unavailable during that time. For the latest status updates, refer to <a href="http://www.eventbritestatus.com" className="text-blue-600 underline">http://www.eventbritestatus.com</a>.
          </p>
        </div>
      </header>

      <nav className="mb-6">
        <ul className="flex space-x-4">
          <li className="font-semibold border-b-2 border-blue-600">Events</li>
          <li>Collections</li>
        </ul>
      </nav>

      <div className="flex items-center mb-6">
        <input type="text" placeholder="Search events" className="border p-2 rounded mr-4" />
        <button onClick={() => setView('list')} className={`px-4 py-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'border'}`}>List View</button>
        <button onClick={() => setView('calendar')} className={`ml-2 px-4 py-2 ${view === 'calendar' ? 'bg-blue-600 text-white' : 'border'}`}>Calendar View</button>
        <div className="relative">
          <button className="ml-2 px-4 py-2 border rounded" onClick={() => setShowFilters(!showFilters)}>
            {selectedFilter}
          </button>
          {showFilters && (
            <ul className="absolute left-0 mt-2 w-full bg-white border rounded shadow-lg z-20">
              {filters.map((filter) => (
                <li
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setShowFilters(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {filter}
                </li>
              ))}
            </ul>
          )}
        </div>
        <NavLink to="../create-event" className={`px-4 py-2 border`}>Create Event</NavLink>
      </div>
      {
        view === 'list' ? (
          <div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="font-semibold">Advertise your event across Eventbrite</p>
              <p>Let more people discover your event by giving it prominent placement across Eventbrite</p>
              <a href="#" className="text-blue-600 underline">Learn more</a>
            </div>
            <div className="border-t border-gray-200">
              <div className="flex items-center py-4">
                <div className="w-1/12 text-center">NOV 23</div>
                <div className="w-3/12 flex items-center">
                  <img src="event-image-url" alt="Event" className="w-12 h-12 mr-4" />
                  <div>
                    <p className="font-semibold">Phat Party</p>
                    <p className="text-sm text-gray-600">Online event</p>
                    <p className="text-sm text-gray-600">Saturday, November 23, 2024 at 10:00 AM PST</p>
                  </div>
                </div>
                <div className="w-2/12 text-center">0 / 20</div>
                <div className="w-2/12 text-center">$0.00</div>
                <div className="w-2/12 text-center text-green-600">On Sale</div>
                <div className="w-2/12 text-center">
                  <button className="text-gray-600">...</button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <a href="#" className="text-blue-600 underline">CSV Export</a>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-gray-200 rounded">
            <header className="flex justify-between items-center mb-4">
              <button onClick={handlePrevMonth} className="bg-blue-600 text-white px-4 py-2 rounded">Previous Month</button>
              <h2 className="text-xl font-bold">{currentMonth.format('MMMM YYYY')}</h2>
              <button onClick={handleNextMonth} className="bg-blue-600 text-white px-4 py-2 rounded">Next Month</button>
            </header>
            <div className="grid grid-cols-7 gap-2 text-center">
              {/* Ngày trong tuần */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-semibold">{day}</div>
              ))}
              {/* Ngày */}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 relative ${day.isBefore(dayjs(), 'day') ? 'bg-gray-200' : 'hover:bg-blue-100 cursor-pointer'}`}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => handleCreateEvent(day)} // Thêm sự kiện click vào ô ngày
                >
                  {day.date()}
                  {/* Hiển thị chữ "Create Event" khi hover */}
                  {hoveredDay?.isSame(day) && !day.isBefore(dayjs(), 'day') && (
                    <NavLink className="absolute inset-0 flex items-center justify-center text-primary bg-blue-500 rounded" to="create">
                      Create Event
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ManageEventPage;
