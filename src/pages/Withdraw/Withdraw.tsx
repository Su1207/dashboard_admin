import { Navigate } from "react-router-dom";
import UsersWithdrawData from "../../components/UsersWithdrawData/UsersWithdrawData";
import { useAuth } from "../../components/auth-context";
import "./Withdraw.scss";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { useEffect, useState } from "react";
const Withdraw = () => {
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
        `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/WITHDRAW`
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
        <UsersWithdrawData />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Withdraw;
