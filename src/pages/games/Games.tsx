import AddGames from "../../components/GamesMarket/AddGames/AddGames";
import GamesDetails from "../../components/GamesMarket/GamesDetails/GamesDetails";
import { useAuth } from "../../components/auth-context";
import "./games.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";
import { Navigate } from "react-router-dom";

const Games = () => {
  const [addGame, setAddGame] = useState(false);

  const handleAddClick = () => {
    setAddGame(!addGame);
  };

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      {isAuthenticated || (isSubAuthenticated && permissions?.MARKET) ? (
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
      ) : (
        <p>No access to this data</p>
      )}
    </>
  );
};

export default Games;
