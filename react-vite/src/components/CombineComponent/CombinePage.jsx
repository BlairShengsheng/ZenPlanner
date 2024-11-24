// import { ViewAllToDoList } from "../ToDoList/ViewAllToDoList";
// import { ViewAllHabit } from "../Habit/ViewAllHabits";
// import { DailyScheduler } from "../Calendar/DailyScheduler";
// // import { useState } from 'react';
// import './combinePage.css';


// export const CombinedPage = () => {
//   // const [selectedDate, setSelectedDate] = useState(new Date());

//   return (
//     <div className="combined-page">
//       <div className="left-panel">
//         {/* <DailyScheduler selectedDate={selectedDate} /> */}
//         <DailyScheduler />
//       </div>
//       <div className="right-panel">
//         <div className="todo-section">
//           <ViewAllToDoList />
//         </div>
//         <div className="habit-section">
//           <ViewAllHabit />
//         </div>
//       </div>
//     </div>
//   );
// };


import { useLocation } from 'react-router-dom';
import { ViewAllToDoList } from "../ToDoList/ViewAllToDoList";
import { ViewAllHabit } from "../Habit/ViewAllHabits";
import { DailyScheduler } from "../Calendar/DailyScheduler";
import { useState, useEffect } from 'react';
import './combinePage.css';

export const CombinedPage = () => {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate || new Date()
  );

  // Update selectedDate when location.state changes
  useEffect(() => {
    if (location.state?.selectedDate) {
      setSelectedDate(location.state.selectedDate);
    }
  }, [location.state]);

  return (
    <div className="combined-page">
      <div className="left-panel">
        <DailyScheduler selectedDate={selectedDate} />
      </div>
      <div className="right-panel">
        <div className="todo-section">
          <h2>Tasks</h2>
          <ViewAllToDoList selectedDate={selectedDate} />
        </div>
        <div className="habit-section">
          <h2>Habits</h2>
          <ViewAllHabit selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};
