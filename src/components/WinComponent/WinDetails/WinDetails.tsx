import { useEffect, useState } from "react";
import "./WinDetails.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import WinDEtailsGrid from "./WinDEtailsGrid";
import { useNavigate } from "react-router-dom";
import { useBidComponentContext } from "../../BidComponent/BidComponentContext";

export interface WinDetailsType {
  phoneNumber: string;
  userName: string;
  gameName: string;
  openClose: string;
  number: string;
  previousPoints: number;
  newPoints: number;
  bidAmount: string;
  winPoints: number;
}

const WinDetails: React.FC<{ gameId: string }> = ({ gameId }) => {
  const [winDetails, setWinDetails] = useState<WinDetailsType[]>([]);
  const [marketName, setMarketName] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);

  const { selectedWinDate } = useBidComponentContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWinDetails = async () => {
      const gameActualKey = gameId.split("___")[0];
      setMarketName(gameId.split("___")[1]);

      const currentYear = selectedWinDate.getFullYear();
      const currentMonth = (selectedWinDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = selectedWinDate.getDate().toString().padStart(2, "0");

      try {
        const winRef = ref(
          database,
          `TOTAL TRANSACTION/WIN/DATE WISE/${currentYear}/${currentMonth}/${currentDay}/${gameActualKey}`
        );

        const winData: WinDetailsType[] = [];
        let totaloint = 0;

        const winSnapshot = await get(winRef);

        winSnapshot.forEach((timestamp) => {
          totaloint += timestamp.val().WIN_POINTS || 0;
          winData.push({
            phoneNumber: timestamp.val().PHONE,
            userName: timestamp.val().NAME,
            gameName: timestamp.val().TYPE,
            openClose: timestamp.val().OPEN_CLOSE,
            number: timestamp.val().NUMBER,
            previousPoints: timestamp.val().PREVIOUS_POINTS,
            newPoints: timestamp.val().NEW_POINTS,
            bidAmount: timestamp.val().POINTS,
            winPoints: timestamp.val().WIN_POINTS,
          });
        });

        setWinDetails(winData);
        setTotalPoints(totaloint);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWinDetails();
  }, [gameId]);

  const handleBackClick = () => {
    // Navigate back to the main page with the selected date
    navigate(`/win`);
  };

  return (
    <div>
      <button className="back_button" onClick={handleBackClick}>
        &lt; Back
      </button>
      <div className="win_header">
        <h2>{marketName}</h2>
        <h4>Total - &#8377; {totalPoints}</h4>
      </div>
      {winDetails && <WinDEtailsGrid winDetails={winDetails} />}
    </div>
  );
};

export default WinDetails;
