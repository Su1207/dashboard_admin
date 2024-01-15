import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import "./UsersDepositData.scss";
// import { parse, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import UserDepositGrid from "./UserDepositGrid";
import { FaFilter } from "react-icons/fa6";

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
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [contributingUsers, setContributingUsers] = useState(0);
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>(""); // State to track the selected payment option

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
          let total_deposit: number = 0;
          const contributingUserSet: Set<string> = new Set();

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
                  total_deposit += timeData.AMOUNT;
                  depositDataArray.push({
                    userPhone,
                    ...timeData,
                  });

                  depositDataArray.sort((a, b) => {
                    const dateA = new Date(a.DATE.replace("|", "")).getTime();
                    const dateB = new Date(b.DATE.replace("|", "")).getTime();
                    return dateB - dateA;
                  });
                  // Track unique contributing users
                  contributingUserSet.add(userPhone);
                });
              }
            });

            promises.push(promise);
          });

          await Promise.all(promises); // Wait for all promises to complete before updating the state
          setTotalDeposit(total_deposit);
          setContributingUsers(contributingUserSet.size);

          // Apply filter only if a payment option is selected
          if (selectedPaymentOption !== "") {
            const filteredDepositData = depositDataArray.filter(
              (item) => item.PAYMENT_APP === selectedPaymentOption
            );
            setDepositData(filteredDepositData);
          } else {
            setDepositData(depositDataArray);
          }
        } else {
          console.log("No users available in the database");
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchDepositData();
  }, [selectedDate, selectedPaymentOption]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  return (
    <div className="usersDeposit">
      <div className="usersdeposit_header">
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
              maxDate={new Date()} // Set the maximum date to the current date

              //   placeholderText="Select a Date"
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>
      <div className="usersTotalDeposit">
        <h4 className="total_deposit_title">TOTAL DEPOSIT</h4>
        <div className="total_deposit">
          <div className="amount">&#8377; {totalDeposit}</div>
          <div className="users_involve">({contributingUsers})</div>
        </div>
        <div className="money_icon">
          <img src="/UserDeposit.png" alt="" className="deposit_image" />
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
            <option className="filter_option" value="GPay">
              GPay
            </option>
            <option className="filter_option" value="phonePay">
              PhonePay
            </option>
            <option className="filter_option" value="paytm">
              Paytm
            </option>
            <option className="filter_option" value="Manual">
              Manual
            </option>
          </select>
        </div>
      </div>
      <div>
        <UserDepositGrid depositData={depositData} />
      </div>
    </div>
  );
};

export default UsersDepositData;
