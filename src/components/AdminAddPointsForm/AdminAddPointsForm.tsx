import React, { useState } from "react";
import { database } from "../../firebase";
import { get, ref, set, update } from "firebase/database";
import ClearIcon from "@mui/icons-material/Clear";
import "./AdminAddPointsForm.scss";
import AddPoints from "../../assets/wallet.png";

interface AdminPointsData {
  phoneNumber: string;
  amount: number;
  paymentApp: string;
  paymentBy: string;
  paymentTo: string;
}

type Props = {
  phoneNumber: string;
  setAddPointsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminAddPointsForm = (props: Props) => {
  const [formData, setFormData] = useState<AdminPointsData>({
    phoneNumber: props.phoneNumber,
    amount: 0,
    paymentApp: "",
    paymentBy: "",
    paymentTo: "",
  });

  const [modalOpen, setIsModalOpen] = useState(true);

  const addPointsByAdmin = async (data: AdminPointsData) => {
    const { phoneNumber, amount, paymentApp, paymentBy, paymentTo } = data;

    // Get the current total amount and user name from the database
    const userRef = ref(database, `USERS/${phoneNumber}`);
    try {
      const snapshot = await get(userRef);
      const currentAmount = snapshot.val()?.AMOUNT || 0;
      const userName = snapshot.val()?.NAME || "";

      // Calculate the new total amount
      const newTotal = currentAmount + amount;

      console.log(newTotal);

      // Update the total amount and name for the user
      await update(userRef, { AMOUNT: newTotal });

      // Add points to the deposit transactions
      const timestamp = Date.now();

      const convertTimestamp = (timestamp: number) => {
        const dateObj = new Date(timestamp);

        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = getMonthName(dateObj.getMonth());
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        const seconds = dateObj.getSeconds().toString().padStart(2, "0");
        const meridiem = hours >= 12 ? "PM" : "AM";
        const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

        return `${day}-${month}-${year} | ${formattedHours}:${minutes}:${seconds} ${meridiem}`;
      };

      function getMonthName(monthIndex: number): string {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return months[monthIndex];
      }

      const date = convertTimestamp(timestamp);

      const year = new Date(timestamp).getFullYear();
      const month = (new Date(timestamp).getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const day = new Date(timestamp).getDate();

      const depositRef = ref(
        database,
        `USERS TRANSACTION/${phoneNumber}/DEPOSIT/DATE WISE/${year}/${month}/${day}/${timestamp}`
      );

      const totalRef = ref(
        database,
        `USERS TRANSACTION/${phoneNumber}/DEPOSIT/TOTAL/${timestamp}`
      );

      await set(depositRef, {
        AMOUNT: amount,
        DATE: date,
        NAME: userName,
        PAYMENT_APP: paymentApp,
        PAYMENT_BY: paymentBy,
        PAYMENT_TO: paymentTo,
        TOTAL: newTotal,
      });

      await set(totalRef, {
        AMOUNT: amount,
        DATE: date,
        NAME: userName,
        PAYMENT_APP: paymentApp,
        PAYMENT_BY: paymentBy,
        PAYMENT_TO: paymentTo,
        TOTAL: newTotal,
      });

      props.setAddPointsFormVisible(false);

      console.log("Points added successfully!");
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!modalOpen);
    props.setAddPointsFormVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPointsByAdmin(formData);
  };

  return (
    <div className={`add ${modalOpen ? "" : "closed"}`}>
      <div className="modal">
        <span className="close" onClick={toggleModal}>
          <ClearIcon />
        </span>
        <h1>
          Add Points
          <span className="addNew">
            <img src={AddPoints} alt="Add New" className="add-new_img" />
          </span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="paymentApp">Payment App:</label>
            <input
              type="text"
              name="paymentApp"
              value={formData.paymentApp}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="paymentBy">Payment By:</label>
            <input
              type="text"
              name="paymentBy"
              value={formData.paymentBy}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="paymentTo">Payment To:</label>
            <input
              type="text"
              name="paymentTo"
              value={formData.paymentTo}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Add Points</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddPointsForm;