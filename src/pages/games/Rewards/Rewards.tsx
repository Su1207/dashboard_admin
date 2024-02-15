import { Navigate, useParams } from "react-router-dom";
import SentRewards from "../../../components/GamesMarket/SentRewards/SentRewards";
import { useAuth } from "../../../components/auth-context";
import { useSubAuth } from "../../../components/subAdmin-authContext";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../../firebase";

const Rewards = () => {
  const { id } = useParams<{ id?: string }>();
  const gameId = id ?? ""; // Provide a default value if id is undefined

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated, user } = useSubAuth();
  const [permission, setPermission] = useState<boolean>();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    try {
      const permissionRef = ref(
        database,
        `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/MARKET`
      );

      const unsub = onValue(permissionRef, (snapshot) => {
        if (snapshot.exists()) {
          setPermission(snapshot.val());
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permission) ? (
        <>
          <h2>{gameId.split("___")[1]}</h2>
          <SentRewards gameId={gameId} />
        </>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Rewards;
