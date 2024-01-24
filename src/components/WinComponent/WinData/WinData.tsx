import { useEffect, useState } from "react";
import "./WinData.scss";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";

interface WinDataType {
  marketkey: string;
  marketName: string;
  openTotal: number;
  closeTotal: number;
}

const WinData: React.FC<{ dateString: string | null }> = ({ dateString }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [winDataType, setWinDataType] = useState<WinDataType[] | null>([]);
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWinData = async () => {
      let currentDay: string = "";
      let currentMonth: string = "";
      let currentYear: string = "";

      if (dateString) {
        [currentDay, currentMonth, currentYear] = dateString.split("-");
        const dateObject = new Date(
          `${currentYear}-${currentMonth}-${currentDay}`
        );
        // Check if selectedDate has changed before updating
        if (dateObject.getTime() !== selectedDate.getTime()) {
          setSelectedDate(dateObject);
        }
      } else {
        currentYear = selectedDate.getFullYear().toString();
        currentMonth = (selectedDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        currentDay = selectedDate.getDate().toString().padStart(2, "0");
      }

      const currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
      setDate(currentDate);

      try {
        const marketRef = ref(
          database,
          `TOTAL TRANSACTION/WIN/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
        );

        const marketSnapshot = await get(marketRef);

        if (marketSnapshot.exists()) {
          const winData: WinDataType[] = [];
          marketSnapshot.forEach((marketsnapshot) => {
            const marketKey = marketsnapshot.key;
            let marketName: string = "";
            let totalOpen: number = 0;
            let totalClose: number = 0;
            marketsnapshot.forEach((timestamp) => {
              marketName = timestamp.val().MARKET_NAME;
              if (timestamp.val().OPEN_CLOSE === "OPEN") {
                totalOpen += timestamp.val().WIN_POINTS;
              } else {
                totalClose += timestamp.val().WIN_POINTS;
              }
            });
            winData.push({
              marketkey: marketKey,
              marketName: marketName,
              openTotal: totalOpen,
              closeTotal: totalClose,
            });
          });

          setWinDataType(winData);
        } else {
          setWinDataType(null);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchWinData();
  }, [selectedDate, dateString]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  //   if (dateString) {
  //     const [day, month, year] = dateString.split("-");
  //     const dateObject = new Date(`${year}-${month}-${day}`);
  //     setSelectedDate(dateObject);
  //   }

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  const handleClick = (gamekey: string, date: string, gameName: string) => {
    navigate(`/win/${gamekey}___${date}___${gameName}`);
  };

  return (
    <div className="winData">
      <div className="winData_header">
        <h2>Win Data</h2>
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
      <div className="winDataList">
        <ul>
          {winDataType ? (
            <li className="header_li">
              <div className="header">
                <p>MARKETS</p>
                <p>OPEN</p>
                <p>CLOSE</p>
                <p>TOTAL</p>
              </div>
            </li>
          ) : (
            <div className="noData">No data available for the day</div>
          )}

          {winDataType &&
            winDataType.map((winData) => (
              <li key={winData.marketkey}>
                <div className="winDataDetails">
                  <p
                    className="gameName"
                    onClick={() =>
                      handleClick(winData.marketkey, date, winData.marketName)
                    }
                  >
                    {winData.marketName}
                  </p>
                  <p className="openTotal">{winData.openTotal}</p>
                  <p className="closeTotal">{winData.closeTotal}</p>
                  <p className="marketTotal">
                    {winData.openTotal + winData.closeTotal}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default WinData;
