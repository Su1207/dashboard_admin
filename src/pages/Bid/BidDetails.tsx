import { Navigate, useParams } from "react-router-dom";
import MarketBidDetails from "../../components/BidComponent/MarketBidDetails/MarketBidDetails";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const BidDetails = () => {
  const { id } = useParams();

  const gameKey = id ?? "";
  console.log(gameKey);

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
        `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/BID`
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
        <MarketBidDetails gameKey={gameKey} />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default BidDetails;
