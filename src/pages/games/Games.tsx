import AddGames from "../../components/AddGames/AddGames";
import GamesDetails from "../../components/GamesDetails/GamesDetails";
import "./games.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";

const Games = () => {
  const [addGame, setAddGame] = useState(false);
  return (
    <div className="games">
      <div className="games_title">
        <h1 className="market">Market</h1>
        <div className="add_games" onClick={() => setAddGame(!addGame)}>
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
