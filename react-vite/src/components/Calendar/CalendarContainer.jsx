// // CalendarContainer.jsx
// import { useState } from 'react';
// import { YearlyCalendar } from './YearlyCalendar';
// import { MonthlyCalendar } from './MonthlyCalendar';
// import { DailyScheduler } from './DailyScheduler';

// export const CalendarContainer = () => {
//   const [view, setView] = useState('yearly'); // 'yearly', 'monthly', or 'daily'
//   const [selectedDate, setSelectedDate] = useState(null);

//   const handleMonthSelect = (date) => {
//     setSelectedDate(date);
//     setView('monthly');
//   };

//   const handleDaySelect = (date) => {
//     setSelectedDate(date);
//     setView('daily');
//   };

//   const handleBackToYear = () => {
//     setView('yearly');
//   };

//   const handleBackToMonth = () => {
//     setView('monthly');
//   };

//   return (
//     <div className="calendar-container">
//       {view === 'yearly' ? (
//         <YearlyCalendar onMonthSelect={handleMonthSelect} />
//       ) : view === 'monthly' ? (
//         <div>
//           <button onClick={handleBackToYear} className="back-button">
//             Back to Year View
//           </button>
//           <MonthlyCalendar 
//             initialDate={selectedDate}
//             onDaySelect={handleDaySelect}
//           />
//         </div>
//       ) : (
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


import { useState } from 'react';
import { YearlyCalendar } from './YearlyCalendar';
import { MonthlyCalendar } from './MonthlyCalendar';
import { DailyScheduler } from './DailyScheduler';
import { useNavigate } from 'react-router-dom';

export const CalendarContainer = () => {
  const navigate = useNavigate(); // Fixed typo in variable name
  const [view, setView] = useState('yearly');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleMonthSelect = (date) => {
    setSelectedDate(date);
    setView('monthly');
    navigate('/monthly');  // Added forward slash for consistency
  };

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    setView('daily');
    navigate('/combine');  // Changed to navigate to combine page
  };

  const handleBackToYear = () => {
    setView('yearly');
    navigate('/');  // Navigate back to root which shows yearly view
  };

  const handleBackToMonth = () => {
    setView('monthly');
    navigate('/monthly');  // Navigate back to monthly view
  };

  return (
    <div className="calendar-container">
      {view === 'yearly' ? (
        <YearlyCalendar onMonthSelect={handleMonthSelect} />
      ) : view === 'monthly' ? (
        <div>
          <button onClick={handleBackToYear} className="back-button">
            Back to Year View
          </button>
          <MonthlyCalendar
            initialDate={selectedDate}
            onDaySelect={handleDaySelect}
          />
        </div>
      ) : (
        <div>
          <button onClick={handleBackToMonth} className="back-button">
            Back to Month View
          </button>
          <DailyScheduler selectedDate={selectedDate} />
        </div>
      )}
    </div>
  );
};
