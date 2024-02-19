import { useEffect, useState } from "react";
import "./TotalUsers.scss";
import { onValue, ref } from "firebase/database";
import { database } from "../../../firebase";

const TotalUsers = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    const userRef = ref(database, "USERS");
    const unsub = onValue(userRef, (snapshot) => {
      setTotalUsers(snapshot.size);
    });

    return () => unsub();
  }, []);
  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title">TOTAL USERS</h4>
      <div className="total_balance ">
        <div className="amount totalUsers">{totalUsers}</div>
      </div>
      <div className="money_icon">
        <img src="/admin.svg" alt="" />
      </div>
    </div>
  );
};

export default TotalUsers;
