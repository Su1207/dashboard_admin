import "./BidTransaction.scss";
import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";

// Define the interface for BID details
interface BidDetails {
  date: string;
  marketName: string;
  name: string;
  number: string;
  openClose: string;
  points: number;
  previousPoints: number;
  type: string;
  uid: string;
}

const BidTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const [bidData, setBidData] = useState<BidDetails[] | null>(null);

  useEffect(() => {
    const bidRef = ref(database, `USERS TRANSACTION/${userId}/BID/TOTAL`);

    const handleBidData = (snapshot: any) => {
      const data = snapshot.val();
      if (!data) return;

      const bidDetailsArray: BidDetails[] = [];

      // Iterate through each game key
      for (const gameKey in data) {
        const gameData = data[gameKey];

        // Iterate through each time key inside the game
        for (const timeKey in gameData) {
          const bidNode = gameData[timeKey];

          const bidDetails: BidDetails = {
            date: bidNode.DATE,
            marketName: bidNode.MARKET_NAME,
            name: bidNode.NAME,
            number: bidNode.NUMBER,
            openClose: bidNode.OPEN_CLOSE,
            points: bidNode.POINTS,
            previousPoints: bidNode.PREVIOUS_POINTS,
            type: bidNode.TYPE,
            uid: bidNode.UID,
          };

          bidDetailsArray.push(bidDetails);
        }
      }

      setBidData(bidDetailsArray);
    };

    // Listen for changes in the BID data
    onValue(bidRef, handleBidData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(bidRef, "value", handleBidData);
    };
  }, [userId]);

  return (
    <div>
      <h2>BID Data for User ID: {userId}</h2>
      <p>{bidData?.length}</p>
      {bidData ? (
        <div>
          {bidData.map((bid, index) => (
            <div key={index}>
              <p>Date: {bid.date}</p>
              <p>Market Name: {bid.marketName}</p>
              <p>Name: {bid.name}</p>
              <p>Number: {bid.number}</p>
              <p>Open/Close: {bid.openClose}</p>
              <p>Points: {bid.points}</p>
              <p>Previous Points: {bid.previousPoints}</p>
              <p>Type: {bid.type}</p>
              <p>UID: {bid.uid}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading BID data...</p>
      )}
    </div>
  );
};

export default BidTransaction;
