import { Navigate } from "react-router-dom";
import UsersWithdrawData from "../../components/UsersWithdrawData/UsersWithdrawData";
import { useAuth } from "../../components/auth-context";
import "./Withdraw.scss";
import { useSubAuth } from "../../components/subAdmin-authContext";
const Withdraw = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <UsersWithdrawData />
    </div>
  );
};

export default Withdraw;
