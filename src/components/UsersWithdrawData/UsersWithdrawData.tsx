import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import "./UsersWithdrawData.scss";
// import { parse, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import UsersWithdrawGrid from "./UsersWithdrawGrid";

interface WithdrawData {
  AMOUNT: number;
  DATE: string;
  APP: string;
  NAME: string;
  PAYOUT_TO: string;
  PENDING: string;
  TYPE: string;
  TOTAL: number;
  UID: string;
  isRejecetd: string;
}

export interface UserWithdraw {
  userPhone: string;
  AMOUNT: number;
  DATE: string;
  NAME: string;
  PAYOUT_TO: string;
  PENDING: string;
  TYPE: string;
  TOTAL: number;
  UID: string;
  isRejecetd: string;
}
const UsersWithdrawData = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [withdrawData, setwithdrawData] = useState<UserWithdraw[] | null>(null);

  useEffect(() => {
    const fetchWithdrawData = async () => {
      const currentYear = selectedDate?.getFullYear();
      const currentMonth = (selectedDate?.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = selectedDate?.getDate();

      const usersRef = ref(database, "USERS");
      try {
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const promises: Promise<void>[] = [];
          const withdrawDataArray: UserWithdraw[] = [];

          usersSnapshot.forEach((userSnapshot) => {
            const userPhone = userSnapshot.key;
            const withdrawRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/WITHDRAW/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            const promise = get(withdrawRef).then((withdrawSnapshot) => {
              if (withdrawSnapshot.exists()) {
                // const depositedData: DepositData[] = [];

                withdrawSnapshot.forEach((timeSnap) => {
                  const timeData = timeSnap.val() as WithdrawData;
                  withdrawDataArray.push({
                    userPhone,
                    ...timeData,
                  });
                });
              }
            });

            promises.push(promise);
          });

          await Promise.all(promises); // Wait for all promises to complete before updating the state
          setwithdrawData(withdrawDataArray);
        } else {
          console.log("No users available in the database");
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchWithdrawData();
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  return (
    <div className="usersWithdraw">
      <div className="usersWithdraw_title">
        <h2>Withdraw </h2>
        <MonetizationOnRoundedIcon
          style={{ fontSize: "1.6rem" }}
          className="transaction_icon"
        />
      </div>
      <div className="date-picker-container">
        <div className="date-pic">
          <DatePicker
            className="datePicker"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd-MMM-yyyy"
            //   placeholderText="Select a Date"
          />
          <div className="calendar">
            <FaCalendarAlt />
          </div>
        </div>
      </div>
      <div>
        <UsersWithdrawGrid withdrawData={withdrawData} />
      </div>
    </div>
  );
};

export default UsersWithdrawData;
