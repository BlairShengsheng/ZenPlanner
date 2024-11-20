import { useState } from 'react';
import './YearlyCalendar.css';

export const YearlyCalendar = ({ onMonthSelect }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleYearChange = (increment) => {
    setSelectedYear(prev => prev + increment);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const createMonthGrid = (monthIndex) => {
    const daysInMonth = getDaysInMonth(monthIndex, selectedYear);
    const firstDay = getFirstDayOfMonth(monthIndex, selectedYear);
    const days = [];
    
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<span key={`empty-${i}`} className="calendar-day empty"></span>);
    }
    
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <span 
          key={`day-${day}`} 
          className="calendar-day"
          onClick={() => onMonthSelect(new Date(selectedYear, monthIndex, day))}
        >
          {day}
        </span>
      );
    }
    
    return days;
  };

  return (
    <div className="minimal-calendar">
      <div className="calendar-header">
        <button 
          className="year-nav-button"
          onClick={() => handleYearChange(-1)}
        >
          ‹
        </button>
        <h1>CALENDAR {selectedYear}</h1>
        <button 
          className="year-nav-button"
          onClick={() => handleYearChange(1)}
        >
          ›
        </button>
      </div>
      <div className="months-grid">
        {months.map((month, index) => (
          <div key={`${month}-${selectedYear}`} className="month-container">
            <h3 className="month-title">{month}</h3>
            <div className="weekdays">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>
            <div className="days-grid">
              {createMonthGrid(index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
