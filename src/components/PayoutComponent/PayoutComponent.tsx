import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import PayoutGrid from "./PayoutGrid";

export type PayoutDataType = {
  key: string;
  name: string;
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
    const fetchPayoutData = async () => {
      const payoutRef = ref(database, "WITHDRAW METHODS");

      const snapshot = await get(payoutRef);
      const payoutArray: PayoutDataType[] = [];
      const promises: Promise<void>[] = [];

      snapshot.forEach((snapShot) => {
        const key = snapShot.key;

        if (snapShot.exists()) {
          const userRef = ref(database, `USERS/${snapShot.key}`);
          const promise = get(userRef).then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const name = userSnapshot.val().NAME;
              payoutArray.push({
                key,
                name,
                ...snapShot.val(),
              });
            }
          });
          promises.push(promise);
        }
      });
      await Promise.all(promises);
      setPayoutData(payoutArray);
    };

    fetchPayoutData();
  }, []);

  console.log(payoutData);
  return (
    <div>
      <PayoutGrid payoutData={payoutData} />
    </div>
  );
};

export default PayoutComponent;
