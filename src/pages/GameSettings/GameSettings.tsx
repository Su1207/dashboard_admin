import { Navigate } from "react-router-dom";
import { usePermissionContext } from "../../components/AdmissionPermission";
import GameSetting from "../../components/GameSetting/GameSetting";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import "./GameSettings.scss";

const GameSettings = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.GAME_SETTINGS) ? (
        <>
          <h1>Game Settings</h1>
          <GameSetting />
        </>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default GameSettings;
