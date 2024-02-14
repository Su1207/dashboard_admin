import { Navigate } from "react-router-dom";
import { usePermissionContext } from "../../components/AdmissionPermission";
import Notifications from "../../components/NotificationComponents/Notifications/Notifications";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import "./Notification.scss";

const Notification = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.NOTIFICATION) ? (
        <Notifications />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Notification;
