import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { database } from "../../../../firebase";
import { useUsersDataContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";

const TodayDeposit = () => {
  const { totalDeposit, setTotalDeposit } = useUsersDataContext();

  useEffect(() => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = currentDate.getDate();

      let totalDepositAmount = 0;

      const depositRef = ref(
        database,
        `TOTAL TRANSACTION/DEPOSIT/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
      );

      const unsub = onValue(depositRef, (depositSnapshot) => {
        if (depositSnapshot.exists()) {
          depositSnapshot.forEach((timeSnap) => {
            const amount = timeSnap.child("AMOUNT").val() as number;
            //   console.log(amount, userPhone);
            totalDepositAmount += amount;
            //   console.log(totalDepositAmount);
          });
          setTotalDeposit(totalDepositAmount);
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/deposit");
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      <h4 className="total_balance_title">TODAY'S DEPOSIT</h4>
      <div className="total_balance ">
        <div className="amount">&#8377; {totalDeposit}</div>
      </div>
      <div className="money_icon">
        <img src="/deposit.svg" alt="" />
      </div>
    </div>
  );
};

export default TodayDeposit;
