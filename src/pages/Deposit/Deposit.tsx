import { Navigate } from "react-router-dom";
import UsersDepositData from "../../components/UsersDepositData/UsersDepositData";
import { useAuth } from "../../components/auth-context";
import "./deposit.scss";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { useEffect, useState } from "react";

const Deposit = () => {
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
        `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/DEPOSIT`
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
        <UsersDepositData />
      ) : (
        <p>No access to this daat!!!</p>
      )}
    </div>
  );
};

export default Deposit;
