import { Navigate } from "react-router-dom";
import UsersDepositData from "../../components/UsersDepositData/UsersDepositData";
import { useAuth } from "../../components/auth-context";
import "./deposit.scss";

const Deposit = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <UsersDepositData />
    </div>
  );
};

export default Deposit;
