import { useAuth } from "../auth-context";
import { useSubAuth } from "../subAdmin-authContext";
import "./navbar.scss";
import { usePermissionContext } from "../AdmissionPermission";

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const { subLogout, isSubAuthenticated } = useSubAuth();

  const handleLogout = () => {
    isAuthenticated ? logout() : subLogout();
  };

  const { username } = usePermissionContext();

  return (
    <div className="navbar">
      <div className="logo">
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
          <span>{username}</span>
        </div>
        <img src="/setting.svg" alt="" className="icon" />
        {(isAuthenticated || isSubAuthenticated) && (
          <span className="logout" onClick={handleLogout}>
            Logout
          </span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
