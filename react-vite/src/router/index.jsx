import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import { ViewAllToDoList } from '../components/ToDoList/ViewAllToDoList';
import { CreateTask } from '../components/ToDoList/CreateToDos';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
