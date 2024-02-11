import { Navigate } from "react-router-dom";
import UsersDepositData from "../../components/UsersDepositData/UsersDepositData";
import { useAuth } from "../../components/auth-context";
import "./deposit.scss";
import { useSubAuth } from "../../components/subAdmin-authContext";

const Deposit = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <UsersDepositData />
    </div>
  );
};

export default Deposit;
