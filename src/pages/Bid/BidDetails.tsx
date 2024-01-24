import { useParams } from "react-router-dom";
import MarketBidDetails from "../../components/BidComponent/MarketBidDetails/MarketBidDetails";

const BidDetails = () => {
  const { id } = useParams();

  const gameKey = id ?? "";
  console.log(gameKey);
  return (
    <div>
      <MarketBidDetails gameKey={gameKey} />
    </div>
  );
};

export default BidDetails;
