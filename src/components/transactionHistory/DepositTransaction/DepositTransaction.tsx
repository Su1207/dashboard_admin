import { useEffect, useState } from "react";
import "./DepositTransaction.scss";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";

interface DepositDetails {
  amount: number;
  date: string;
  name: string;
  paymentApp: string;
  paymentBy: string;
  paymentTo: string;
  total: number;
  uid: string;
}

const DepositTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const [depositData, setDepositData] = useState<DepositDetails[] | null>(null);

  useEffect(() => {
    const depositRef = ref(
      database,
      `USERS TRANSACTION/${userId}/DEPOSIT/TOTAL`
    );

    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      if (!data) {
        return;
      }

      const depositDetailsArray: DepositDetails[] = [];

      for (const key in data) {
        const depositNode = data[key];
        // const timestamp = parseInt(key, 10);
        // const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
        //   day: "2-digit",
        //   month: "2-digit",
        //   year: "numeric",
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   second: "2-digit",
        //   hour12: true,
        // });

        const depositDetails: DepositDetails = {
          amount: depositNode.AMOUNT,
          date: depositNode.DATE,
          name: depositNode.NAME,
          paymentApp: depositNode.PAYMENT_APP,
          paymentBy: depositNode.PAYMENT_BY,
          paymentTo: depositNode.PAYMENT_TO,
          total: depositNode.TOTAL,
          uid: depositNode.UID,
        };

        depositDetailsArray.push(depositDetails);
      }

      setDepositData(depositDetailsArray);
    };

    onValue(depositRef, handleData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(depositRef, "value", handleData);
    };
  }, [userId]);

  return (
    <div>
      <h2>Deposit History for User ID: {userId}</h2>
      <hr />
      <br />
      {depositData ? (
        <div>
          {depositData.map((deposit, index) => (
            <div key={index}>
              <h3>Deposit</h3>
              <p>Amount: {deposit.amount}</p>
              <p>Date: {deposit.date}</p>
              <p>Name: {deposit.name}</p>
              <p>Payment App: {deposit.paymentApp}</p>
              <p>Payment By: {deposit.paymentBy}</p>
              <p>Payment To: {deposit.paymentTo}</p>
              <p>Total: {deposit.total}</p>
              <p>UID: {deposit.uid}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading deposit history...</p>
      )}
    </div>
  );
};

export default DepositTransaction;
