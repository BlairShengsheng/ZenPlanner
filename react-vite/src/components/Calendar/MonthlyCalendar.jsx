//this one fix the month to day

// MonthlyCalendar.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MonthlyCalendar.css';

export const MonthlyCalendar = ({ onDaySelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected date from navigation state or use current date as fallback
  const [currentDate, setCurrentDate] = useState(() => {
    const locationDate = location.state?.selectedDate;
    // return locationDate ? new Date(locationDate) : new Date();
    if (locationDate) {
      // If it's an ISO string, parse it
      return typeof locationDate === 'string' 
        ? new Date(locationDate)
        : locationDate;
    }
    return new Date();
  });

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
    if (onDaySelect) {
      onDaySelect(date);
    }
    navigate('/combine', { 
      state: { 
        selectedDate: date.toISOString(), // Convert to ISO string for better serialization
        returnMonth: currentDate // Store the current month view
      } 
    });
  };

  // const handleBackToYear = () => {
  //   navigate('/');
  // };


  const handleBackToYear = () => {
    navigate('/', {
      state: {
        selectedDate: currentDate // Pass the current date back to year view
      }
    });
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
      <div className="calendar-navigation">
        <button onClick={handleBackToYear} className="back-button">
          Back to Year View
        </button>
      </div>
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
