import { useEffect, useState } from "react";
import "./GameChart.scss";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

type MarketListType = {
  marketName: string;
  marketId: string;
};

const MarketChart = () => {
  const [marketList, setMarketList] = useState<MarketListType[] | null>(null);
  const [Loading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const marketRef = ref(database, "GAMES");

      const marketListArray: MarketListType[] | null = [];

      const unsub = onValue(marketRef, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((game) => {
            const marketId = game.key;

            let marketName: string = "";

            if (game.exists()) {
              marketName = game.val().NAME;
            }

            marketListArray.push({
              marketName,
              marketId,
            });
          });

          setMarketList(marketListArray);
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //   console.log(marketList);
  const navigate = useNavigate();

  const handleClick = (marketId: string) => {
    navigate(`gameChartResult___${marketId}`);
  };

  return (
    <div className="marketChart">
      <h3>Select Market</h3>

      {Loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {marketList &&
            marketList.map((market) => (
              <div
                className="marketData"
                key={market.marketId}
                onClick={() => handleClick(market.marketId)}
              >
                <li>
                  <span>{market.marketName}</span>
                  <span>
                    <ArrowForwardIosIcon className="market_icon" />
                  </span>
                </li>
              </div>
            ))}
        </ul>
      )}
    </div>
  );
};

export default MarketChart;
