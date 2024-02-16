import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../../firebase";

const TodayWin = () => {
  const [totalWin, setTotalWin] = useState(0);

  useEffect(() => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = currentDate.getDate();

      let totalWinAmount = 0;

      const winRef = ref(
        database,
        `TOTAL TRANSACTION/WIN/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
      );

      const unsub = onValue(winRef, (winSnapshot) => {
        if (winSnapshot.exists()) {
          winSnapshot.forEach((market) => {
            market.forEach((timeSnap) => {
              const amount = timeSnap.child("WIN_POINTS").val() as number;
              //   console.log(amount, userPhone);
              totalWinAmount += amount;
              //   console.log(totalWithdrawAmount);
            });
          });
        }
        setTotalWin(totalWinAmount);
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title">TODAY'S WIN</h4>
      <div className="total_balance ">
        <div className="amount">&#8377; {totalWin}</div>
      </div>
      <div className="money_icon">
        <img src="/win1.svg" alt="" />
      </div>
    </div>
  );
};

export default TodayWin;
