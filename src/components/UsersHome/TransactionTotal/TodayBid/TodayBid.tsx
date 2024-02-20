import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../../firebase";
import { useNavigate } from "react-router-dom";

const TodayBid = () => {
  const [totalBid, setTotalBid] = useState(0);

  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = (currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0"); // Ensure two digits
        const currentDay = currentDate.getDate();

        let totalBidAmount = 0;

        const userRef = ref(database, "USERS");

        const usersSnapshot = await get(userRef);

        if (usersSnapshot.exists()) {
          const promises: Promise<void>[] = [];

          usersSnapshot.forEach((userSnapshot) => {
            const userPhone = userSnapshot.key;
            const bidRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/BID/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
            );

            const promise = get(bidRef).then((bidSnapshot) => {
              if (bidSnapshot.exists()) {
                bidSnapshot.forEach((gameKey) => {
                  gameKey.forEach((timeSnap) => {
                    const amount = timeSnap.child("POINTS").val() as number;

                    totalBidAmount += amount;
                  });
                });
              }
            });
            promises.push(promise);
          });
          await Promise.all(promises);
          setTotalBid(totalBidAmount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBidData();
  }, []);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/bid");
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      <h4 className="total_balance_title">TODAY'S BID</h4>
      <div className="total_balance ">
        <div className="amount">&#8377; {totalBid}</div>
      </div>
      <div className="money_icon">
        <img src="/auction1.svg" alt="" />
      </div>
    </div>
  );
};

export default TodayBid;
