import AddGames from "../../components/GamesMarket/AddGames/AddGames";
import GamesDetails from "../../components/GamesMarket/GamesDetails/GamesDetails";
import { useAuth } from "../../components/auth-context";
import "./games.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";
import { Navigate } from "react-router-dom";
import { database } from "../../firebase";
import { get, ref } from "firebase/database";

const Games = () => {
  const [addGame, setAddGame] = useState(false);

  const handleAddClick = () => {
    setAddGame(!addGame);
  };

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated, user } = useSubAuth();
  const { switched } = usePermissionContext();
  const [permission, setPermission] = useState<boolean>();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    try {
      const permissionRef = ref(
        database,
        `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/USERS`
      );

      get(permissionRef).then((snapshot: any) => {
        if (snapshot.exists()) {
          setPermission(snapshot.val());
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [switched]);

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      {isAuthenticated || (isSubAuthenticated && permission) ? (
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
