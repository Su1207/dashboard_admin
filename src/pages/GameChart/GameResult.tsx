import { useNavigate, useParams } from "react-router-dom";
import GameChartComponent from "../../components/GameChartComponent/GameChartComponent";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./gameResult.scss";

const GameResult = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/gameChart");
  };

  const marketId = id ?? "";
  return (
    <div className="gameResult">
      <h2 onClick={handleClick}>
        <span>
          <ArrowBackIosNewIcon />
        </span>{" "}
        Game Chart
      </h2>
      <GameChartComponent marketId={marketId} />
    </div>
  );
};

export default GameResult;
