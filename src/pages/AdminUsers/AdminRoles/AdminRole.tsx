import { Navigate, useParams } from "react-router-dom";
import AdminRoles from "../../../components/AdminUsersComponent/AdminRoles/AdminRoles";
import { useAuth } from "../../../components/auth-context";
import { useSubAuth } from "../../../components/subAdmin-authContext";

const AdminRole = () => {
  const { id } = useParams();
  const adminId = id ?? "";

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();

  if (!isAuthenticated || !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated ? (
        <AdminRoles adminId={adminId.split("___")[1]} />
      ) : (
        <p>No access to this data</p>
      )}
    </div>
  );
};

export default AdminRole;
