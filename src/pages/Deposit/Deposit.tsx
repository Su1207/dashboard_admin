import { Navigate } from "react-router-dom";
import UsersDepositData from "../../components/UsersDepositData/UsersDepositData";
import { useAuth } from "../../components/auth-context";
import "./deposit.scss";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";

const Deposit = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permissions?.DEPOSIT) ? (
        <UsersDepositData />
      ) : (
        <p>No access to this daat!!!</p>
      )}
    </div>
  );
};

export default Deposit;
