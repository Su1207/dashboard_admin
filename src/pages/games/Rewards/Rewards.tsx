import { useParams } from "react-router-dom";
import SentRewards from "../../../components/GamesMarket/SentRewards/SentRewards";

const Rewards = () => {
  const { id } = useParams<{ id?: string }>();
  const gameId = id ?? ""; // Provide a default value if id is undefined

  return (
    <div>
      <h2>{gameId.split("___")[1]}</h2>
      <SentRewards gameId={gameId} />
    </div>
  );
};

export default Rewards;
