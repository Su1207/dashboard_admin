import { get, onValue, ref } from "firebase/database";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { database } from "../firebase";

type UsersPermissions = {
  USERS: boolean;
  USERS_DEPOSIT: boolean;
  USERS_WITHDRAW: boolean;
};

interface PermissionContextProps {
  permissions: UsersPermissions | null;
  setPermissions: (data: UsersPermissions | null) => void;
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined
);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<UsersPermissions | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString !== null) {
      const user = JSON.parse(userString);
      const username = user.ID;
      const permissionRef = ref(
        database,
        `ADMIN/SUB_ADMIN/${username}/PERMISSIONS`
      );

      get(permissionRef).then((permissionSnapshot) => {
        if (permissionSnapshot.exists()) {
          setPermissions(permissionSnapshot.val());
        }
      });

      const unsubscribe = onValue(permissionRef, (permissionSnapshot) => {
        if (permissionSnapshot.exists()) {
          setPermissions(permissionSnapshot.val());
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        setPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermissionContext must be used within an PermissionProvider"
    );
  }
  return context;
};
