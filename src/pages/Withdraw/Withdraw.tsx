import { Navigate } from "react-router-dom";
import UsersWithdrawData from "../../components/UsersWithdrawData/UsersWithdrawData";
import { useAuth } from "../../components/auth-context";
import "./Withdraw.scss";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";
const Withdraw = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.WITHDRAW) ? (
        <UsersWithdrawData />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Withdraw;
