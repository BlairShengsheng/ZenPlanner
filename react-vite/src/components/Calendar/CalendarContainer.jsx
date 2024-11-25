// CalendarContainer.jsx


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { YearlyCalendar } from './YearlyCalendar';
import { MonthlyCalendar } from './MonthlyCalendar';
import { DailyScheduler } from './DailyScheduler';

// export const CalendarContainer = () => {
//   const navigate = useNavigate();
//   const [selectedDate, setSelectedDate] = useState(null);

//   const handleMonthSelect = (date) => {
//     setSelectedDate(date);
//     // Navigate to monthly view with the selected date as state
//     navigate('/monthly', { state: { selectedDate: date } });
//   };

//   const handleDaySelect = (date) => {
//     setSelectedDate(date);
//     navigate('/combine', { state: { selectedDate: date } });
//   };

//   const handleBackToYear = () => {
//     navigate('/');
//   };

//   const handleBackToMonth = () => {
//     navigate('/monthly', { state: { selectedDate } });
//   };

//   // Determine which view to show based on the current route
//   const pathname = window.location.pathname;

//   return (
//     <div className="calendar-container">
//       {pathname === '/' && (
//         <YearlyCalendar onMonthSelect={handleMonthSelect} />
//       )}
//       {pathname === '/monthly' && (
//         <div>
//           <button onClick={handleBackToYear} className="back-button">
//             Back to Year View
//           </button>
//           <MonthlyCalendar
//             initialDate={selectedDate}
//             onDaySelect={handleDaySelect}
//           />
//         </div>
//       )}
//       {pathname === '/combine' && (
//         <div>
//           <button onClick={handleBackToMonth} className="back-button">
//             Back to Month View
//           </button>
//           <DailyScheduler selectedDate={selectedDate} />
//         </div>
//       )}
//     </div>
//   );
// };


import { useLocation } from 'react-router-dom';

export const CalendarContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(() => {
    const locationDate = location.state?.selectedDate;
    return locationDate ? new Date(locationDate) : new Date();
  });

  const handleMonthSelect = (date) => {
    setSelectedDate(date);
    navigate('/monthly', { 
      state: { selectedDate: date }
    });
  };

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    navigate('/combine', { 
      state: { 
        selectedDate: date,
        returnMonth: date // Store the month we're coming from
      }
    });
  };

  return (
    <div className="calendar-container">
      {location.pathname === '/' && (
        <YearlyCalendar onMonthSelect={handleMonthSelect} />
      )}
      {location.pathname === '/monthly' && (
        <div>
          <MonthlyCalendar
            initialDate={selectedDate}
            onDaySelect={handleDaySelect}
          />
        </div>
      )}
      {location.pathname === '/combine' && (
        <div>
          <DailyScheduler selectedDate={selectedDate} />
        </div>
      )}
    </div>
  );
};
