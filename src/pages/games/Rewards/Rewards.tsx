import { Navigate, useParams } from "react-router-dom";
import SentRewards from "../../../components/GamesMarket/SentRewards/SentRewards";
import { useAuth } from "../../../components/auth-context";
import { useSubAuth } from "../../../components/subAdmin-authContext";
import { usePermissionContext } from "../../../components/AdmissionPermission";

const Rewards = () => {
  const { id } = useParams<{ id?: string }>();
  const gameId = id ?? ""; // Provide a default value if id is undefined

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.MARKET) ? (
        <>
          <h2>{gameId.split("___")[1]}</h2>
          <SentRewards gameId={gameId} />
        </>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Rewards;
