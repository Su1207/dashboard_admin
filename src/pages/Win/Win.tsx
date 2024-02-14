import { Navigate } from "react-router-dom";
import { usePermissionContext } from "../../components/AdmissionPermission";
import WinData from "../../components/WinComponent/WinData/WinData";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";

const Win = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.WIN) ? (
        <WinData />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Win;
