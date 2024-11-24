// // MonthlyCalendar.jsx
// import { useState } from 'react';
// import './MonthlyCalendar.css';

// export const MonthlyCalendar = ({ initialDate, onDaySelect }) => {
//   const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

//   const getDaysInMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   };

//   const handlePrevMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
//   };

//   const renderCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentDate);
//     const firstDay = getFirstDayOfMonth(currentDate);
//     const days = [];

//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < firstDay; i++) {
//       days.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
//     }

//     // Add the days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//       days.push(
//         <div
//           key={`day-${day}`}
//           className="calendar-cell"
//           onClick={() => onDaySelect && onDaySelect(date)}
//         >
//           {day}
//         </div>
//       );
//     }

//     return days;
//   };

//   return (
//     <div className="monthly-calendar">
//       <div className="calendar-header">

//         <button onClick={handlePrevMonth} className="nav-button">←</button>
//         <h2>{months[currentDate.getMonth()].toUpperCase()}</h2>
//         <button onClick={handleNextMonth} className="nav-button">→</button>
//       </div>

//       <div className="calendar-grid">
//         <div className="weekdays">
//           {daysOfWeek.map(day => (
//             <div key={day} className="weekday">{day}</div>
//           ))}
//         </div>
//         <div className="days">
//           {renderCalendarDays()}
//         </div>
//       </div>
//     </div>
//   );
// };



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MonthlyCalendar.css';

export const MonthlyCalendar = ({ initialDate, onDaySelect }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date) => {
    // Call the onDaySelect prop if provided
    if (onDaySelect) {
      onDaySelect(date);
    }
    // Navigate to combine page with the selected date
    navigate('/combine', { state: { selectedDate: date } });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-cell ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="monthly-calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-button">←</button>
        <h2>{months[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}</h2>
        <button onClick={handleNextMonth} className="nav-button">→</button>
      </div>
      <div className="calendar-grid">
        <div className="weekdays">
          {daysOfWeek.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};
