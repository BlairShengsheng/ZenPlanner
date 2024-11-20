import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import { ViewAllToDoList } from '../components/ToDoList/ViewAllToDoList';
import { CreateTask } from '../components/ToDoList/CreateToDos';
import { CalendarContainer } from '../components/Calendar/CalendarContainer';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        
        element:<CalendarContainer />
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
      {
        path: "tasks/new",
        element: <CreateTask />
      }
    ],
  },
]);
