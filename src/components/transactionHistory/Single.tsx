import { useEffect, useState } from "react";
import "./single.scss";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../firebase";

interface TransactionDetails {
  amount: number;
  date: string;
  name: string;
  paymentApp?: string; // Include paymentApp for deposit
  paymentBy?: string; // Include paymentBy for deposit
  paymentTo?: string; // Include paymentTo for deposit
  app?: string; // Include app for withdrawal
  payoutTo?: string; // Include payoutTo for withdrawal
  pending?: string; // Include pending for withdrawal
  total: number;
  type?: string;
  uid: string;
}

const Single: React.FC<{ userId: number }> = ({ userId }) => {
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionDetails[] | null
  >(null);

  useEffect(() => {
    const depositRef = ref(
      database,
      `USERS TRANSACTION/${userId}/DEPOSIT/TOTAL`
    );
    const withdrawalRef = ref(
      database,
      `USERS TRANSACTION/${userId}/WITHDRAW/TOTAL`
    );

    const handleData = (snapshot: any, type: string) => {
      const data = snapshot.val();
      if (!data) return;

      const nodesArray: TransactionDetails[] = [];

      for (const key in data) {
        const node = data[key];
        // const timestamp = parseInt(key, 12);
        // const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
        //   day: "2-digit",
        //   month: "2-digit",
        //   year: "numeric",
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   second: "2-digit",
        //   hour12: true,
        // });

        const transactionDetails: TransactionDetails = {
          amount: node.AMOUNT,
          date: node.DATE,
          name: node.NAME,
          total: node.TOTAL,
          uid: node.UID,
        };

        if (type === "deposit") {
          transactionDetails.paymentApp = node.PAYMENT_APP || "";
          transactionDetails.paymentBy = node.PAYMENT_BY || "";
          transactionDetails.paymentTo = node.PAYMENT_TO || "";
        } else if (type === "withdrawal") {
          transactionDetails.app = node.APP || "";
          transactionDetails.payoutTo = node.PAYOUT_TO || "";
          transactionDetails.pending = node.PENDING || "";
          transactionDetails.type = node.TYPE || "";
        }

        nodesArray.push(transactionDetails);
      }

      setTransactionHistory((prevData) => {
        const combinedNodes = [...(prevData || []), ...nodesArray];
        return combinedNodes.sort((a, b) => {
          const dateA = new Date(a.date.replace("|", "")).getTime();
          const dateB = new Date(b.date.replace("|", "")).getTime();
          return dateB - dateA;
        });
      });
    };

    const depositCallback = (snapshot: any) => handleData(snapshot, "deposit");
    const withdrawalCallback = (snapshot: any) =>
      handleData(snapshot, "withdrawal");

    onValue(depositRef, depositCallback);
    onValue(withdrawalRef, withdrawalCallback);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(depositRef, "value", depositCallback);
      off(withdrawalRef, "value", withdrawalCallback);
    };
  }, []);

  // console.log(transactionHistory);

  return (
    <div>
      <h2>Transaction History</h2>
      <hr />
      <br />
      {transactionHistory ? (
        <div>
          {transactionHistory.map((node, index) => (
            <div key={index}>
              <h3>{node.paymentTo ? "Deposit" : "Withdraw"}</h3>
              <p>Amount: {node.amount}</p>
              <p>Date: {node.date}</p>
              <p>Name: {node.name}</p>
              {node.paymentApp && <p>Payment App: {node.paymentApp}</p>}
              {node.paymentBy && <p>Payment By: {node.paymentBy}</p>}
              {node.paymentTo && <p>Payment To: {node.paymentTo}</p>}
              {node.app && <p>App: {node.app}</p>}
              {node.payoutTo && <p>Payout To: {node.payoutTo}</p>}
              {node.pending && <p>Pending: {node.pending}</p>}
              <p>Total: {node.total}</p>
              {node.type && <p>Type: {node.type}</p>}
              <p>UID: {node.uid}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading transaction history...</p>
      )}
    </div>
  );
};

export default Single;
