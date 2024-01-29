import { get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import PayoutGrid from "./PayoutGrid";

export type PayoutDataType = {
  ACC_IFSC: string;
  ACC_NAME: string;
  ACC_NUM: string;
  GPAY: string;
  PAYTM: string;
  PHONEPE: string;
  UPI: string;
};

const PayoutComponent = () => {
  const [payoutData, setPayoutData] = useState<PayoutDataType[] | null>(null);

  useEffect(() => {
    const payoutRef = ref(database, "WITHDRAW METHODS");

    get(payoutRef).then((snapshot) => {
      if (snapshot.exists()) {
        setPayoutData(snapshot.val());
      }
    });

    const unsubs = onValue(payoutRef, (snapshot) => {
      if (snapshot.exists()) {
        setPayoutData(snapshot.val());
      }
    });

    return () => unsubs();
  }, []);

  console.log(payoutData);
  return (
    <div>
      <PayoutGrid payoutData={payoutData} />
    </div>
  );
};

export default PayoutComponent;
