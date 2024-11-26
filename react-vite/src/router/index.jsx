import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';


import { ViewAllToDoList } from '../components/ToDoList/ViewAllToDoList';
// import { CreateTask } from '../components/ToDoList/CreateToDos';
import { CalendarContainer } from '../components/Calendar/CalendarContainer';
// import { CreateHabit } from '../components/Habit/CreateHabits';
import { ViewAllHabit } from '../components/Habit/ViewAllHabits';

import { CombinedPage } from '../components/CombineComponent/CombinePage';
import { ViewAllTimeBlocks } from '../components/TimeBlock/ViewAllTimeBlocks';
import { CreateTimeBlock } from '../components/TimeBlock/CreateTimeBlock';
import { EditTimeBlock } from '../components/TimeBlock/EditTimeBlock';
import { MonthlyCalendar } from '../components/Calendar/MonthlyCalendar';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element:<CalendarContainer />
      },
      {
        path: "monthly",  // This matches the navigation to /monthly
        element: <MonthlyCalendar />
      },
      {
        path: "combine",  // This matches the navigation to /combine
        element: <CombinedPage />
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "tasks/",
        element: <ViewAllToDoList />,
      },
      // {
      //   path: "tasks/new",
      //   element: <CreateTask />
      // },
      {
        path: "habits/",
        element:<ViewAllHabit />
      },
      // {
      //   path: "habits/new",
      //   element: <CreateHabit />
      // },
      {
        path: "timeblocks/",
        element: <ViewAllTimeBlocks />
      },
      {
        path: "timeblocks/new",
        element:<CreateTimeBlock />
      },
      {
        path: "timeblocks/:timeblockId/edit",
        element: <EditTimeBlock />
      }

    ],
  },
]);
