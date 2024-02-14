import { Navigate } from "react-router-dom";
import AdminUsersComponent from "../../components/AdminUsersComponent/AdminUsersComponent";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import "./AdminUsers.scss";

const AdminUsers = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();

  if (!isSubAuthenticated || !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated ? (
        <AdminUsersComponent />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default AdminUsers;
