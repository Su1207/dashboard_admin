import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import "./TransactionTotal.scss";

import { useUsersDataContext } from "../UserContext";
const TransactionTotal = () => {
  const { totalDeposit, setTotalDeposit } = useUsersDataContext();
  const { totalWithdraw, setTotalWithdraw } = useUsersDataContext();
  const [totalBid, setTotalBid] = useState(0);
  const [totalWin, setTotalWin] = useState(0);

  useEffect(() => {
    const fetchDepositData = async () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = currentDate.getDate();

      const usersRef = ref(database, "USERS");
      try {
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          let totalDepositAmount = 0;
          let totalWithdrawAmount = 0;
          let totalBidAmount = 0;
          let totalWinAmount = 0;

          usersSnapshot.forEach((userSnapshot) => {
            const userPhone = userSnapshot.key;
            // console.log(userPhone);
            const depositRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/DEPOSIT/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            const withdrawRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/WITHDRAW/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            const bidRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/BID/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            const winRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/WIN/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            // Fetch deposit data for the current day for each user
            get(depositRef).then((depositSnapshot) => {
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

            get(withdrawRef).then((withdrawSnapshot) => {
              if (withdrawSnapshot.exists()) {
                withdrawSnapshot.forEach((timeSnap) => {
                  const amount = timeSnap.child("AMOUNT").val() as number;
                  //   console.log(amount, userPhone);
                  totalWithdrawAmount += amount;
                  //   console.log(totalWithdrawAmount);
                });
                setTotalWithdraw(totalWithdrawAmount);
              }
            });

            get(bidRef).then((bidSnapshot) => {
              if (bidSnapshot.exists()) {
                bidSnapshot.forEach((timeSnap) => {
                  const amount = timeSnap.child("AMOUNT").val() as number;
                  //   console.log(amount, userPhone);
                  totalBidAmount += amount;
                  //   console.log(totalWithdrawAmount);
                });
                setTotalBid(totalBidAmount);
              }
            });
            get(winRef).then((winSnapshot) => {
              if (winSnapshot.exists()) {
                winSnapshot.forEach((timeSnap) => {
                  const amount = timeSnap.child("AMOUNT").val() as number;
                  //   console.log(amount, userPhone);
                  totalWinAmount += amount;
                  //   console.log(totalWithdrawAmount);
                });
                setTotalWin(totalWinAmount);
              }
            });
          });
        } else {
          console.log("No users available in the database");
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchDepositData();
  }, []);

  return (
    <div className="transaction">
      <div className="transaction_title">
        <h3>Transaction</h3>
        <div className="transaction_icon">
          <MonetizationOnRoundedIcon style={{ fontSize: "1.6rem" }} />
        </div>
      </div>
      <div className="transaction_details_container">
        <div className="transaction_detail">
          <div className="transaction_type">Deposit</div>
          <div className="value">{totalDeposit}</div>
        </div>
        <div className="transaction_detail">
          <div className="transaction_type">Withdraw</div>
          <div className="value">{totalWithdraw}</div>
        </div>
        <div className="transaction_detail">
          <div className="transaction_type"> Bid </div>
          <div className="value">{totalBid}</div>
        </div>
        <div className="transaction_detail">
          <div className="transaction_type">Win</div>
          <div className="value">{totalWin}</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTotal;
