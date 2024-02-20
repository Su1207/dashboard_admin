import { useEffect, useState } from "react";
import "./GameChart.scss";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { CSVLink } from "react-csv";

type Props = {
  marketId: string;
};

type resultData = {
  date: string | undefined;
  open: string;
  mid: string;
  close: string;
};

const GameChartComponent = ({ marketId }: Props) => {
  const [resultData, setResultData] = useState<resultData[]>([]);
  const [Loading, setIsLoading] = useState(true);

  const previousDate = Date.now() - 90 * 24 * 60 * 60 * 1000;

  const convertToDate = (timestamp: number) => {
    if (timestamp) {
      const dateString = new Date(Number(timestamp));

      const date = dateString.getDate().toString().padStart(2, "0");
      const month = getMonthName(dateString.getMonth());
      const year = dateString.getFullYear();

      return `${date}-${month}-${year}`;
    }
  };

  function getMonthName(monthIndex: number): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  }

  useEffect(() => {
    try {
      const gameRef = ref(database, `GAME CHART/${marketId.split("___")[1]}`);

      const resultDataArray: resultData[] | null = [];

      const unsub = onValue(gameRef, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((timeSnap) => {
            const timeStamp = Number(timeSnap.key);

            if (timeStamp >= previousDate) {
              const date = convertToDate(timeStamp);

              const open = timeSnap.val().OPEN;
              const mid = timeSnap.val().MID;
              const close = timeSnap.val().CLOSE;
              resultDataArray.push({
                date,
                open,
                mid,
                close,
              });
            }
          });

          setResultData(resultDataArray);
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="gameChart">
      {Loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="gameChart_container">
            {resultData &&
              resultData.map((result) => (
                <div
                  className="gameChart_data"
                  key={`${result.date}${result.open}${result.close}${result.mid}`}
                >
                  <div className="gameChart_date">{result.date}</div>
                  <div className="border"></div>
                  <div className="gameChart_result">
                    {result.open}-{result.mid}-{result.close}
                  </div>
                </div>
              ))}
          </div>

          <CSVLink
            data={resultData}
            filename={"game_chart_data.csv"}
            className="download_button"
          >
            <button>Download</button>
          </CSVLink>
        </div>
      )}
    </div>
  );
};

export default GameChartComponent;
