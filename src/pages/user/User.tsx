import { Navigate, useParams } from "react-router-dom";
import "./user.scss";
import UserDetail from "../../components/UserDetail/UserDetail";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";

const User = () => {
  //this way ensure that useParams never return undefined value
  const { id } = useParams<{ id?: string }>();
  const userId = id ?? ""; // Provide a default value if id is undefined
  console.log(userId);

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.USERS) ? (
        <UserDetail userId={Number(userId)} />
      ) : (
        <p>No access to this data</p>
      )}
    </div>
  );
};

export default User;
