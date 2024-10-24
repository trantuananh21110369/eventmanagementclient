import React from 'react'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';

function CalendarView() {

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [hoveredDay, setHoveredDay] = useState<dayjs.Dayjs | null>(null);


  const startDay = currentMonth.startOf('month').startOf('week');
  const endDay = currentMonth.endOf('month').endOf('week');

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const days = [];
  let day = startDay;
  while (day.isBefore(endDay)) {
    days.push(day);
    day = day.add(1, 'day');
  }


  return (
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

export default CalendarView
