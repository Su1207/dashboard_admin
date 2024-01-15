import { Navigate } from "react-router-dom";
import UsersWithdrawData from "../../components/UsersWithdrawData/UsersWithdrawData";
import { useAuth } from "../../components/auth-context";
import "./Withdraw.scss";
const Withdraw = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <UsersWithdrawData />
    </div>
  );
};

export default Withdraw;
