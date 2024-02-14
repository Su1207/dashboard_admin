import { createContext, ReactNode, useContext, useState } from "react";

type UsersPermissions = {
  BID: boolean;
  DEPOSIT: boolean;
  GAME_RATE: boolean;
  GAME_SETTINGS: boolean;
  MANUAL_REQUEST: boolean;
  MARKET: boolean;
  NOTIFICATION: boolean;
  PAYOUT: boolean;
  SETTINGS: boolean;
  USERS: boolean;
  USERS_DEPOSIT: boolean;
  USERS_WITHDRAW: boolean;
  WIN: boolean;
  WITHDRAW: boolean;
  [key: string]: boolean; // Add index signature
};

interface PermissionContextProps {
  switched: boolean;
  setSwitched: (data: boolean) => void;
  username: string | null;
  setUsername: (data: string | null) => void;
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
  const [username, setUsername] = useState<string | null>(null);
  const [switched, setSwitched] = useState(false);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        setPermissions,
        username,
        setUsername,
        switched,
        setSwitched,
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
