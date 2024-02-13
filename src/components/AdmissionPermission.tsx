import { get, ref } from "firebase/database";
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
  username: string;
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
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      const userString = localStorage.getItem("user");
      if (userString !== null) {
        const user = await JSON.parse(userString);
        setUsername(user.ID);
      }
      if (!username) return;

      const permissionRef = ref(
        database,
        `ADMIN/SUB_ADMIN/${username}/PERMISSIONS`
      );

      const permissionSnapshot = await get(permissionRef);
      if (permissionSnapshot.exists()) {
        setPermissions(permissionSnapshot.val());
      }
    };

    fetchPermissions();
  }, [username]);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        setPermissions,
        username,
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
