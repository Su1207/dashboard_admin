import { Navigate } from "react-router-dom";
import { usePermissionContext } from "../../components/AdmissionPermission";
import GameRateData from "../../components/GameRate/GameRateData";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import "./GameRate.scss";

const GameRate = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.GAME_RATE) ? (
        <GameRateData />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default GameRate;
