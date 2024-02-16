import { ReactNode, createContext, useContext, useState } from "react";

export type User = {
  AMOUNT: number;
  APP_VERSION: number;
  CREATED_ON: number;
  LAST_SEEN: number;
  NAME: string;
  PASSWORD: string;
  PHONE: string;
  PIN: string;
  UID: string;
  isLoggedIn: boolean;
};

//create interface for the context
interface UsersDataContextProps {
  usersData: User[] | null;
  setUsersData: React.Dispatch<React.SetStateAction<User[] | null>>;
  totalDeposit: number;
  setTotalDeposit: React.Dispatch<React.SetStateAction<number | 0>>;
  totalWithdraw: number;
  setTotalWithdraw: React.Dispatch<React.SetStateAction<number | 0>>;
  yesterdayWithdraw: number;
  setYesterdayWithdraw: React.Dispatch<React.SetStateAction<number | 0>>;
  yesterdayDeposit: number;
  setYesterdayDeposit: React.Dispatch<React.SetStateAction<number | 0>>;
  //   totalWin: number;
  //   setTotalWin: React.Dispatch<React.SetStateAction<number | 0>>;
  //   totalBid: number;
  //   setTotalBid: React.Dispatch<React.SetStateAction<number | 0>>;
}

//create context
const UsersDataContext = createContext<UsersDataContextProps | null>(null);

//create a provider component
export const UsersDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersData, setUsersData] = useState<User[] | null>(null);
  const [totalDeposit, setTotalDeposit] = useState(0);
  //   const [totalBid, setTotalBid] = useState(0);
  //   const [totalWin, setTotalWin] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [yesterdayWithdraw, setYesterdayWithdraw] = useState(0);
  const [yesterdayDeposit, setYesterdayDeposit] = useState(0);

  return (
    <UsersDataContext.Provider
      value={{
        usersData,
        setUsersData,
        totalDeposit,
        setTotalDeposit,
        totalWithdraw,
        setTotalWithdraw,
        yesterdayWithdraw,
        setYesterdayWithdraw,
        yesterdayDeposit,
        setYesterdayDeposit,
      }}
    >
      {children}
    </UsersDataContext.Provider>
  );
};

//create a custom hook for using the context
export const useUsersDataContext = () => {
  const context = useContext(UsersDataContext);
  if (!context) {
    throw new Error(
      "useUsersDataContext must be used within a UsersDataProvider"
    );
  }

  return context;
};
