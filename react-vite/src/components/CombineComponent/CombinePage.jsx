import { ViewAllToDoList } from "../ToDoList/ViewAllToDoList";
import { ViewAllHabit } from "../Habit/ViewAllHabits";
import { DailyScheduler } from "../Calendar/DailyScheduler";
// import { useState } from 'react';
import './combinePage.css';


export const CombinedPage = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="combined-page">
      <div className="left-panel">
        {/* <DailyScheduler selectedDate={selectedDate} /> */}
        <DailyScheduler />
      </div>
      <div className="right-panel">
        <div className="todo-section">
          <ViewAllToDoList />
        </div>
        <div className="habit-section">
          <ViewAllHabit />
        </div>
      </div>
    </div>
  );
};
