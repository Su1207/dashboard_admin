import AddGames from "../../components/GamesMarket/AddGames/AddGames";
import GamesDetails from "../../components/GamesMarket/GamesDetails/GamesDetails";
import "./games.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";

const Games = () => {
  const [addGame, setAddGame] = useState(false);

  const handleAddClick = () => {
    setAddGame(!addGame);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="games">
      <div className="games_title">
        <h1 className="market">Market</h1>
        <div className="add_games" onClick={handleAddClick}>
          Add New <AddCircleIcon />
        </div>
      </div>

      {addGame && (
        <div>
          <AddGames setAddGame={setAddGame} />
        </div>
      )}

      <GamesDetails />
    </div>
  );
};

export default Games;
