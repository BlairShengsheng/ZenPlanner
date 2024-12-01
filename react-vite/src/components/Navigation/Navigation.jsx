import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";

// function Navigation() {
//   return (
//     <ul>
//       <li>
//         <NavLink to="/">Home</NavLink>
//       </li>

//       <li>
//         <ProfileButton />
//       </li>
//     </ul>
//   );
// }

function Navigation() {
  const user = useSelector((store)=> store.session.user);
  const navigate = useNavigate();

  // if(!user) navigate(`/login`);

  //The error occurs because you're calling navigate directly in the component body. In React, navigation should be handled within useEffect or event handlers.



    // Use useEffect to handle navigation
    useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

  return (
    <div className="wrapper">

      <div className="nav-link-area">
        <NavLink to="/">Home</NavLink>
        <div className="profile-button"><ProfileButton /></div>
      </div>
     


      <div className="nav-link-area-two">
        <NavLink to="/tasks/">Tasks</NavLink>
        <NavLink to="/habits/">Habits</NavLink>
        <NavLink to="/timeblocks/">TimeBlocks</NavLink>
        <NavLink to="/">HabitTracker</NavLink>
      </div>


      <div className="user-name">
        <h2>{!user? "Welcome!": `Hello, I'm ${user.username}`}</h2>
      </div>

    </div>
  );
}

export default Navigation;
