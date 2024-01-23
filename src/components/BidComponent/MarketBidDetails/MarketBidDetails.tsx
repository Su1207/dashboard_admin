import { useEffect } from "react";
import "./MarketBidDetails.scss";

const MarketBidDetails: React.FC<{ gameKey: string }> = ({ gameKey }) => {
  useEffect(() => {}, [gameKey]);
  return (
    <div>
      <div>MarketBid Details</div>
    </div>
  );
};

export default MarketBidDetails;
