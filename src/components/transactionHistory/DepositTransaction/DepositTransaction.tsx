import { useEffect } from "react";
import "./DepositTransaction.scss";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useTransactionContext, DepositDetails } from "../TransactionContext";
import DepositDataGrid from "./DepositDataGrid";

type Depositdetails = DepositDetails;

const DepositTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const { depositData, setDepositData } = useTransactionContext();

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

      const depositDetailsArray: Depositdetails[] = [];

      for (const key in data) {
        const depositNode = data[key];

        const depositDetails: Depositdetails = {
          amount: depositNode.AMOUNT,
          date: depositNode.DATE,
          name: depositNode.NAME,
          paymentApp: depositNode.PAYMENT_APP,
          paymentBy: depositNode.PAYMENT_BY,
          paymentTo: depositNode.PAYMENT_TO,
          total: depositNode.TOTAL,
          uid: depositNode.UID,
          appVersion: depositNode.APP_VERSION,
        };

        depositDetailsArray.push(depositDetails);
      }

      depositDetailsArray.sort((a, b) => {
        const dateA = new Date(a.date.replace("|", "")).getTime();
        const dateB = new Date(b.date.replace("|", "")).getTime();
        return dateB - dateA;
      });

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
      <h2>Deposit History</h2>
      {/* <hr />
      <br /> */}
      {depositData ? <DepositDataGrid depositData={depositData} /> : ""}
      {/* <div>
          {depositData.map((deposit, index) => (
            <div key={index} className="depositContainer">
              <div className="pointsAdded_side">
                <div className="pointsAdded">+{deposit.amount}</div>
              </div>
              <div className="divider"></div>
              <div className="details_side">
                <div className="details_item">
                  Date - <span className="item_value">{deposit.date}</span>
                </div>
                <div className="details_item">
                  Total - <span className="item_value">{deposit.total}</span>
                </div>
                <div className="details_item">
                  Payment App -{" "}
                  <span className="item_value">{deposit.paymentApp}</span>
                </div>
                <div className="details_item">
                  Payment By -{" "}
                  <span className="item_value">{deposit.paymentBy}</span>
                </div>
              </div>

              {/* <p>Name: {deposit.name}</p>

              <p>Payment To: {deposit.paymentTo}</p>

              <p>UID: {deposit.uid}</p> 
            </div>
          ))} */}
    </div>
  );
};

export default DepositTransaction;
