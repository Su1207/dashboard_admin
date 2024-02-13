import { createContext, ReactNode, useContext, useState } from "react";

type UsersPermissions = {
  USERS: boolean;
  USERS_DEPOSIT: boolean;
  USERS_WITHDRAW: boolean;
};

interface PermissionContextProps {
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

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        setPermissions,
        username,
        setUsername,
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
