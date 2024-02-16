import { useUsersDataContext } from "../UserContext";
import "./TotalBalance.scss";

const TotalBalance = () => {
  const { usersData } = useUsersDataContext();

  const totalAmount = usersData?.reduce(
    (total, user) => total + user.AMOUNT,
    0
  );

  const contributingUsers = usersData?.filter((user) => user.AMOUNT > 0);
  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title">TOTAL BALANCE</h4>
      <div className="total_balance ">
        <div className="amount">&#8377; {totalAmount}</div>
        <div className="users_involve">({contributingUsers?.length})</div>
      </div>
      <div className="money_icon">
        <img src="balance.svg" alt="" />
      </div>
    </div>
  );
};

export default TotalBalance;
