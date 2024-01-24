import { useEffect, useState } from "react";
import "./MarketBidData.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";

type BidDataType = {
  gameKey: string;
  gameName: string;
  openTotal: number;
  closeTotal: number;
};

const MarketBidData = () => {
  const [bidDataType, setBidDataType] = useState<BidDataType[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketData = async () => {
      const currentYear = selectedDate.getFullYear();
      const currentMonth = (selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = selectedDate.getDate().toString().padStart(2, "0");

      const currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
      setDate(currentDate);

      try {
        const gamesRef = ref(database, "GAMES");

        const marketSnapshot = await get(gamesRef);

        const gameRef = ref(
          database,
          `TOTAL TRANSACTION/BIDS/${currentYear}/${currentMonth}/${currentDay}`
        );

        const gameSnapshot = await get(gameRef);

        if (gameSnapshot.exists()) {
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
                    numberSnapshot
                      .child("USERS")
                      .forEach((userSnapshot: any) => {
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
        } else {
          setBidDataType(null);
          toast.error("No data available for the date");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchMarketData();
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  const handleOpenClick = (gamekey: string, gamename: string, date: string) => {
    navigate(`/bid/OPEN___${gamekey}___${gamename}___${date}`);
  };

  const handleCloseClick = (
    gamekey: string,
    gamename: string,
    date: string
  ) => {
    navigate(`/bid/CLOSE___${gamekey}___${gamename}___${date}`);
  };

  return (
    <div className="bidData">
      <div className="bidData_header">
        <h2>Bid Data</h2>
        <div className="date-picker-container">
          <div className="date-pic">
            <DatePicker
              className="datePicker"
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd-MMM-yyyy"
              maxDate={new Date()} // Set the maximum date to the current date

              //   placeholderText="Select a Date"
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>
      <div className="bidDataList">
        <ul style={{ listStyle: "none" }}>
          {bidDataType && (
            <li className="header_li">
              <div className="header">
                <p>MARKETS</p>
                <p>OPEN</p>
                <p>CLOSE</p>
              </div>
            </li>
          )}

          {bidDataType &&
            bidDataType.map((bidData) => (
              <li key={bidData.gameKey}>
                <div className="bidDataDetails">
                  <p className="gameName">{bidData.gameName}</p>
                  <p
                    className="openTotal"
                    onClick={() =>
                      handleOpenClick(bidData.gameKey, bidData.gameName, date)
                    }
                  >
                    {bidData.openTotal}
                  </p>
                  <p
                    className="closeTotal"
                    onClick={() =>
                      handleCloseClick(bidData.gameKey, bidData.gameName, date)
                    }
                  >
                    {bidData.closeTotal}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MarketBidData;
