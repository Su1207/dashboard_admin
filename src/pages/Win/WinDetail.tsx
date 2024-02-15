import { Navigate, useParams } from "react-router-dom";
import WinDetails from "../../components/WinComponent/WinDetails/WinDetails";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { useAuth } from "../../components/auth-context";
import { database } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

const WinDetail = () => {
  const { id } = useParams();

  const gameId = id ?? "";

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
        `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/WIN`
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
        <WinDetails gameId={gameId} />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default WinDetail;
