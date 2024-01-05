import "./WithdrawTransaction.scss";

import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";

interface WithdrawalDetails {
  amount: number;
  date: string;
  name: string;
  app: string;
  payoutTo: string;
  pending: string;
  type: string;
  total: number;
  uid: string;
}

const WithdrawTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const [withdrawData, setWithdrawData] = useState<WithdrawalDetails[] | null>(
    null
  );

  useEffect(() => {
    const withdrawalRef = ref(
      database,
      `USERS TRANSACTION/${userId}/WITHDRAW/TOTAL`
    );

    const handleWithdrawalData = (snapshot: any) => {
      const data = snapshot.val();
      if (!data) return;

      const withdrawalDetailsArray: WithdrawalDetails[] = [];

      for (const key in data) {
        const withdrawalNode = data[key];
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

        const withdrawalDetails: WithdrawalDetails = {
          amount: withdrawalNode.AMOUNT,
          date: withdrawalNode.DATE,
          name: withdrawalNode.NAME,
          app: withdrawalNode.APP,
          payoutTo: withdrawalNode.PAYOUT_TO,
          pending: withdrawalNode.PENDING,
          type: withdrawalNode.TYPE,
          total: withdrawalNode.TOTAL,
          uid: withdrawalNode.UID,
        };

        withdrawalDetailsArray.push(withdrawalDetails);
      }

      setWithdrawData(withdrawalDetailsArray);
    };

    onValue(withdrawalRef, handleWithdrawalData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(withdrawalRef, "value", handleWithdrawalData);
    };
  }, [userId]);

  return (
    <div>
      <h2>Withdrawal History for User ID: {userId}</h2>
      <hr />
      <br />
      {withdrawData ? (
        <div>
          {withdrawData.map((withdrawal, index) => (
            <div key={index}>
              <h3>Withdrawal</h3>
              <p>Amount: {withdrawal.amount}</p>
              <p>Date: {withdrawal.date}</p>
              <p>Name: {withdrawal.name}</p>
              <p>App: {withdrawal.app}</p>
              <p>Payout To: {withdrawal.payoutTo}</p>
              <p>Pending: {withdrawal.pending}</p>
              <p>Type: {withdrawal.type}</p>
              <p>Total: {withdrawal.total}</p>
              <p>UID: {withdrawal.uid}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading withdrawal history...</p>
      )}
    </div>
  );
};

export default WithdrawTransaction;
