import "./WinTransaction.scss";
import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";

interface WinDetails {
  date: string;
  marketId: string;
  marketName: string;
  name: string;
  newPoints: number;
  number: string;
  openClose: string;
  phone: string;
  points: string;
  previousPoints: number;
  type: string;
  winPoints: number;
}

const WinTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const [winData, setWinData] = useState<WinDetails[] | null>(null);

  useEffect(() => {
    const winRef = ref(database, `USERS TRANSACTION/${userId}/WIN/TOTAL`);

    const handleWinData = (snapshot: any) => {
      const data = snapshot.val();
      if (!data) return;

      const winDetailsArray: WinDetails[] = [];

      // Iterate through each game key
      for (const gameKey in data) {
        const gameData = data[gameKey];
        console.log(gameKey);

        // Iterate through each time key inside the game
        for (const timeKey in gameData) {
          const winNode = gameData[timeKey];

          const winDetails: WinDetails = {
            date: winNode.DATE,
            marketId: winNode.MARKET_ID,
            marketName: winNode.MARKET_NAME,
            name: winNode.NAME,
            newPoints: winNode.NEW_POINTS,
            number: winNode.NUMBER,
            openClose: winNode.OPEN_CLOSE,
            phone: winNode.PHONE,
            points: winNode.POINTS,
            previousPoints: winNode.PREVIOUS_POINTS,
            type: winNode.TYPE,
            winPoints: winNode.WIN_POINTS,
          };

          winDetailsArray.push(winDetails);
        }
      }

      setWinData(winDetailsArray);
    };

    // Listen for changes in the WIN data
    onValue(winRef, handleWinData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(winRef, "value", handleWinData);
    };
  }, [userId]);

  return (
    <div>
      <h2>WIN Data for User ID: {userId}</h2>
      {winData ? (
        <div>
          {winData.map((win, index) => (
            <div key={index}>
              <p>Date: {win.date}</p>
              <p>Market ID: {win.marketId}</p>
              <p>Market Name: {win.marketName}</p>
              <p>Name: {win.name}</p>
              <p>New Points: {win.newPoints}</p>
              <p>Number: {win.number}</p>
              <p>Open/Close: {win.openClose}</p>
              <p>Phone: {win.phone}</p>
              <p>Points: {win.points}</p>
              <p>Previous Points: {win.previousPoints}</p>
              <p>Type: {win.type}</p>
              <p>Win Points: {win.winPoints}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading WIN data...</p>
      )}
    </div>
  );
};

export default WinTransaction;
