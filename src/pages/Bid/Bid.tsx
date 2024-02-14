import { Navigate } from "react-router-dom";
import { usePermissionContext } from "../../components/AdmissionPermission";
import MarketBidData from "../../components/BidComponent/MarketBidData/MarketBidData";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";

const Bid = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.BID) ? (
        <MarketBidData />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Bid;
