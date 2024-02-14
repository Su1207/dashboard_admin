import { Navigate } from "react-router-dom";
import { usePermissionContext } from "../../components/AdmissionPermission";
import PayoutComponent from "../../components/PayoutComponent/PayoutComponent";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import "./Payout.scss";
const Payout = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      {isAuthenticated || (isSubAuthenticated && permissions?.PAYOUT) ? (
        <div className="payout">
          <h2>Payout Details</h2>
          <PayoutComponent />
        </div>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </>
  );
};

export default Payout;
