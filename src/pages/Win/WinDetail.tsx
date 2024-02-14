import { Navigate, useParams } from "react-router-dom";
import WinDetails from "../../components/WinComponent/WinDetails/WinDetails";
import { usePermissionContext } from "../../components/AdmissionPermission";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { useAuth } from "../../components/auth-context";

const WinDetail = () => {
  const { id } = useParams();

  const gameId = id ?? "";

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated && isSubAuthenticated && permissions?.WIN ? (
        <WinDetails gameId={gameId} />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default WinDetail;
