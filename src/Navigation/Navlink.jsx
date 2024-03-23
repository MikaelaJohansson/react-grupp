import { NavLink } from "react-router-dom"

const Navigation = () => {
  return (
    <nav>{/**Skapa länkar till våra routes */}
      <ul>
        <li>{/**Lägg till flera länkar här under */}
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
