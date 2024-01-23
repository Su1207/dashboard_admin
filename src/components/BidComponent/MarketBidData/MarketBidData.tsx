import { useEffect, useState } from "react";
import "./MarketBidData.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";

type BidDataType = {
  gameKey: string;
  gameName: string;
  openTotal: number;
  closeTotal: number;
};

const MarketBidData = () => {
  const [bidDataType, setBidDataType] = useState<BidDataType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketData = async () => {
      //   const currentDate = new Date();
      //   const currentYear = currentDate.getFullYear();
      //   const currentMonth = (currentDate.getMonth() + 1)
      //     .toString()
      //     .padStart(2, "0"); // Ensure two digits
      //   const currentDay = currentDate.getDate().toString().padStart(2, "0");

      //   const gamesRef = ref(database, "GAMES");

      try {
        const gamesRef = ref(database, "GAMES");

        const marketSnapshot = await get(gamesRef);

        const gameRef = ref(database, `TOTAL TRANSACTION/BIDS/${2024}/01/11`);

        const gameSnapshot = await get(gameRef);
        const bidData: BidDataType[] = [];

        gameSnapshot.forEach((gamesnapshot) => {
          const marketKey = gamesnapshot.key;
          const marketName: string[] = [];

          marketSnapshot.forEach((marketsnapshot) => {
            if (marketKey === marketsnapshot.key) {
              marketName.push(marketsnapshot.val().NAME);
            }
          });

          const calculateTotalPoints = (snapshot: any) => {
            let totalPoints: number = 0;

            if (snapshot.exists()) {
              snapshot.forEach((gameTypeSnapshot: any) => {
                gameTypeSnapshot.forEach((numberSnapshot: any) => {
                  numberSnapshot.child("USERS").forEach((userSnapshot: any) => {
                    totalPoints += userSnapshot.val() || 0;
                  });
                });
              });
            }

            return totalPoints;
          };

          const totalPointsOpen = calculateTotalPoints(
            gamesnapshot.child("OPEN")
          );
          const totalPointsClose = calculateTotalPoints(
            gamesnapshot.child("CLOSE")
          );

          bidData.push({
            gameKey: marketKey,
            gameName: marketName.join(", "), // Concatenate game names into a string
            openTotal: totalPointsOpen,
            closeTotal: totalPointsClose,
          });

          setBidDataType(bidData);
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchMarketData();
  }, []);

  console.log(bidDataType);

  const handleClick = (gamekey: string) => {
    navigate(`/bid/${gamekey}`);
  };

  return (
    <div className="bidData">
      <h2>Market Bid Data</h2>
      <div className="bidDataList">
        <ul style={{ listStyle: "none" }}>
          <li className="header_li">
            <div className="header">
              <p>MARKETS</p>
              <p>OPEN</p>
              <p>CLOSE</p>
            </div>
          </li>

          {bidDataType &&
            bidDataType.map((bidData) => (
              <li key={bidData.gameKey}>
                <div className="bidDataDetails">
                  <p
                    className="gameName"
                    onClick={() => handleClick(bidData.gameKey)}
                  >
                    {bidData.gameName}
                  </p>
                  <p className="openTotal">{bidData.openTotal}</p>
                  <p>{bidData.closeTotal}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MarketBidData;
