import React, { useState } from 'react';
import { YearlyCalendar } from './YearlyCalendar';
// import { SchedulerCalendar } from './Calendar';

export const CalendarContainer = () => {
  const [view, setView] = useState('yearly'); // 'yearly' or 'monthly'
  const [selectedDate, setSelectedDate] = useState(null);

  const handleMonthSelect = (date) => {
    setSelectedDate(date);
    setView('monthly');
  };

  const handleBackToYear = () => {
    setView('yearly');
  };

  return (
    <div>
      {view === 'yearly' ? (
        <YearlyCalendar onMonthSelect={handleMonthSelect} />
      ) : (
        <div>
          <button 
            onClick={handleBackToYear}
            style={{
              margin: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#4444ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Year View
          </button>
          {/* <SchedulerCalendar initialDate={selectedDate} /> */}
        </div>
      )}
    </div>
  );
};
