import { Navigate } from "react-router-dom";
import { usePermissionContext } from "../../components/AdmissionPermission";
import ManualRequests from "../../components/ManualRequestComponent/ManualRequests";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import "./ManualRequest.scss";

const ManualRequest = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated ||
      (isSubAuthenticated && permissions?.MANUAL_REQUEST) ? (
        <ManualRequests />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default ManualRequest;
