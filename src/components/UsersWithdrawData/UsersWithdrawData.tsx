import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import "./UsersWithdrawData.scss";
// import { parse, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import UsersWithdrawGrid from "./UsersWithdrawGrid";
import { FaFilter } from "react-icons/fa6";

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
}

export interface UserWithdraw {
  userPhone: string;
  timestamp: string;
  AMOUNT: number;
  APP: string;
  DATE: string;
  NAME: string;
  PAYOUT_TO: string;
  PENDING: string;
  TYPE: string;
  TOTAL: number;
  UID: string;
}
const UsersWithdrawData = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [withdrawData, setwithdrawData] = useState<UserWithdraw[] | null>(null);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [contributingUsers, setContributingUsers] = useState(0);
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("");

  const [checked, setChecked] = useState<boolean>(false);

  const handleDataFromChild = (data: boolean) => {
    setChecked(data);
  };

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
          let total_withdraw: number = 0;
          const contributingUserSet: Set<string> = new Set();

          usersSnapshot.forEach((userSnapshot) => {
            const userPhone = userSnapshot.key;
            const withdrawRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/WITHDRAW/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            const promise = get(withdrawRef).then((withdrawSnapshot) => {
              if (withdrawSnapshot.exists()) {
                withdrawSnapshot.forEach((timeSnap) => {
                  const timestamp = timeSnap.key;
                  const timeData = timeSnap.val() as WithdrawData;
                  total_withdraw += timeData.AMOUNT;
                  withdrawDataArray.push({
                    userPhone,
                    timestamp,
                    ...timeData,
                  });

                  withdrawDataArray.sort((a, b) => {
                    const dateA = new Date(a.DATE.replace("|", "")).getTime();
                    const dateB = new Date(b.DATE.replace("|", "")).getTime();
                    return dateB - dateA;
                  });
                  contributingUserSet.add(userPhone);
                });
              }
            });

            promises.push(promise);
          });

          await Promise.all(promises); // Wait for all promises to complete before updating the state
          setTotalWithdraw(total_withdraw);
          setContributingUsers(contributingUserSet.size);

          if (selectedPaymentOption !== "") {
            const filterWithdrawData = withdrawDataArray.filter(
              (item) => item.APP === selectedPaymentOption
            );
            setwithdrawData(filterWithdrawData);
          } else {
            setwithdrawData(withdrawDataArray);
          }
        } else {
          console.log("No users available in the database");
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchWithdrawData();
  }, [selectedDate, selectedPaymentOption, checked]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  return (
    <div className="usersWithdraw">
      <div className="usersWithdraw_header">
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
              maxDate={new Date()} // Set the maximum date to the current date

              //   placeholderText="Select a Date"
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>
      <div className="usersTotalWithdraw">
        <h4 className="total_withdraw_title">TOTAL WITHDRAW</h4>
        <div className="total_withdraw">
          <div className="amount">&#8377; {totalWithdraw}</div>
          <div className="users_involve">({contributingUsers})</div>
        </div>
        <div className="money_icon">
          <img src="/UserWithdraw.png" alt="" className="withdraw_image" />
        </div>
      </div>
      <div className="payment-option">
        <label>Payment Option</label>
        <div className="payment-option_input">
          <div className="filter_icon">
            <FaFilter size={18} />
          </div>
          <select
            value={selectedPaymentOption}
            className="select_filter_option"
            onChange={(e) => setSelectedPaymentOption(e.target.value)}
          >
            <option className="filter_option" value="">
              All
            </option>
            <option className="filter_option" value="Admin">
              Admin
            </option>
            <option className="filter_option" value="GPAY">
              GPay
            </option>
            <option className="filter_option" value="PHONEPE">
              PhonePay
            </option>
            <option className="filter_option" value="PAYTM">
              Paytm
            </option>
            <option className="filter_option" value="MANUAL">
              Manual
            </option>
          </select>
        </div>
      </div>
      <div></div>
      <div>
        <UsersWithdrawGrid
          withdrawData={withdrawData}
          onDataFromChild={handleDataFromChild}
        />
      </div>
    </div>
  );
};

export default UsersWithdrawData;
