import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import "./UsersDepositData.scss";
// import { parse, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import UserDepositGrid from "./UserDepositGrid";

interface DepositData {
  AMOUNT: number;
  DATE: string;
  NAME: string;
  PAYMENT_BY: string;
  PAYMENT_APP: string;
  PAYMENT_TO: string;
  TOTAL: number;
  UID: string;
}

export interface UserDeposit {
  userPhone: string;
  AMOUNT: number;
  DATE: string;
  NAME: string;
  PAYMENT_BY: string;
  PAYMENT_APP: string;
  PAYMENT_TO: string;
  TOTAL: number;
  UID: string;
}

const UsersDepositData = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [depositData, setDepositData] = useState<UserDeposit[] | null>(null);

  useEffect(() => {
    const fetchDepositData = async () => {
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
          const depositDataArray: UserDeposit[] = [];

          usersSnapshot.forEach((userSnapshot) => {
            const userPhone = userSnapshot.key;
            const depositRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/DEPOSIT/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            const promise = get(depositRef).then((depositSnapshot) => {
              if (depositSnapshot.exists()) {
                // const depositedData: DepositData[] = [];

                depositSnapshot.forEach((timeSnap) => {
                  const timeData = timeSnap.val() as DepositData;
                  depositDataArray.push({
                    userPhone,
                    ...timeData,
                  });
                });
              }
            });

            promises.push(promise);
          });

          await Promise.all(promises); // Wait for all promises to complete before updating the state
          setDepositData(depositDataArray);
        } else {
          console.log("No users available in the database");
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchDepositData();
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);

    console.log(depositData);
  }

  return (
    <div className="usersDeposit">
      <div className="usersDeposit_title">
        <h2>Deposit </h2>

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
        <UserDepositGrid depositData={depositData} />
      </div>
    </div>
  );
};

export default UsersDepositData;
