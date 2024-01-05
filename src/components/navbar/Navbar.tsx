import "./navbar.scss";
import { RiMenu3Line } from "react-icons/ri";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <div className="hamburger">
          <RiMenu3Line />
        </div>
        <img src="/logo.svg" alt="" />
        <span>Admin Dashboard</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className="user">
          <span>Admin</span>
        </div>
        <img src="/setting.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
