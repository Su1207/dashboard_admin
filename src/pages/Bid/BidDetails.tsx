import { Navigate, useParams } from "react-router-dom";
import MarketBidDetails from "../../components/BidComponent/MarketBidDetails/MarketBidDetails";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";

const BidDetails = () => {
  const { id } = useParams();

  const gameKey = id ?? "";
  console.log(gameKey);

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.BID) ? (
        <MarketBidDetails gameKey={gameKey} />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default BidDetails;
