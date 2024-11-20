import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

// import { useSelector } from "react-redux";

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
  // const user = useSelector((store)=> store.session.user);

  return (
    <div className="wrapper">
      <div className="nav-link-area">
        <NavLink to="/">Home</NavLink>
        <div><ProfileButton /></div>
      </div>

    </div>
  );
}

export default Navigation;
