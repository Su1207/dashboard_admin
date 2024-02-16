import { useUsersDataContext } from "../UserContext";
import "./TotalUsers.scss";

const TotalUsers = () => {
  const { usersData } = useUsersDataContext();
  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title">TOTAL USERS</h4>
      <div className="total_balance ">
        <div className="amount totalUsers">{usersData?.length}</div>
      </div>
      <div className="money_icon">
        <img src="/admin.svg" alt="" />
      </div>
    </div>
  );
};

export default TotalUsers;
