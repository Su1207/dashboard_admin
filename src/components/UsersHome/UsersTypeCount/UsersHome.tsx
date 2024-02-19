import { useEffect, useMemo, useState } from "react";
import "./UsersHome.scss";
import { get, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useUsersDataContext } from "../UserContext";
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";

type User = {
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

type UsersListData = Record<string, boolean>;

type UsersTransactionData = Set<string>;

const UsersHome: React.FC = () => {
  const { usersData, setUsersData } = useUsersDataContext();
  const [usersListData, setUsersListData] = useState<UsersListData | null>(
    null
  );

  const [usersTransactionData, setUsersTransactionData] =
    useState<UsersTransactionData | null>(null);

  useEffect(() => {
    const usersListRef = ref(database, "USERS LIST");
    const transactionRef = ref(database, "USERS TRANSACTION");

    get(usersListRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUsersListData(snapshot.val());
        console.log(snapshot.val());
      } else {
        console.log("No data available for USERS LIST");
      }
    });

    get(transactionRef).then((snapshot) => {
      if (snapshot.exists()) {
        const phoneNumbers = Object.keys(snapshot.val());
        const transactionData = new Set(phoneNumbers);
        setUsersTransactionData(transactionData);
      } else {
        console.log("No data available for USERS");
      }
    });

    const unsubscribe = onValue(usersListRef, (snapshot) => {
      if (snapshot.exists()) {
        setUsersListData(snapshot.val());
        // console.log(usersListData);
      } else {
        console.log("No data available for USERS LIST");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const usersef = ref(database, `USERS`);
      try {
        const snapshot = await get(usersef);
        if (snapshot.exists()) {
          // Assert the type of snapshot.val() to User[]
          const userData: User[] = Object.values(snapshot.val()) as User[];
          setUsersData(userData);
        } else {
          console.log("No data available for USERS");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const unsubscribe = onValue(usersef, (snapshot) => {
        if (snapshot.exists()) {
          setUsersData(Object.values(snapshot.val()));
        } else {
          console.log("No data available for USERS LIST");
        }
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, []);

  const isBlocked = (userId: string) => {
    return usersListData?.[userId] === false;
  };

  const isDead = (userId: string) => {
    console.log(usersTransactionData?.has(userId));
    return !usersTransactionData?.has(userId);
  };

  const today = new Date().setHours(0, 0, 0, 0);
  const liveThreshold = 1 * 60 * 1000; //1 min in milliseconds
  const currentTimestamp = new Date().getTime();
  const oneDayMilliseconds = 24 * 60 * 60 * 1000;

  // Calculate the following values outside of the render method
  const blockedUsers = useMemo(
    () => usersData?.filter((user) => isBlocked(user.PHONE)),
    [usersData]
  );
  const todayRegistered = useMemo(
    () => usersData?.filter((user) => today < user.CREATED_ON),
    [usersData]
  );
  const liveUsers = useMemo(
    () =>
      usersData?.filter(
        (user) => currentTimestamp - user.LAST_SEEN <= liveThreshold
      ),
    [usersData]
  );
  const last24 = useMemo(
    () =>
      usersData?.filter(
        (user) => currentTimestamp - user.LAST_SEEN <= oneDayMilliseconds
      ),
    [usersData]
  );
  const zeroBalanceUsers = useMemo(
    () => usersData?.filter((user) => user.AMOUNT === 0),
    [usersData]
  );
  const deadUsers = useMemo(
    () => usersData?.filter((user) => isDead(user.PHONE)),
    [usersData]
  );
  const activeUsers = useMemo(
    () => usersData?.filter((user) => !isDead(user.PHONE)),
    [usersData]
  );

  return (
    <div className="users">
      <h3 className="user_title">USERS</h3>
      <div className="different_users_details">
        <div className="users_number">
          <div className="users_number_type">Active Users </div>
          <div> {activeUsers?.length}</div>
        </div>
        <div className="users_number">
          <div className="users_number_type">Blocked Users </div>
          <div> {blockedUsers?.length}</div>
        </div>
        <div className="users_number">
          <div className="users_number_type">Today Registered</div>
          <div> {todayRegistered?.length}</div>
        </div>
        <div className="users_number">
          <div className="users_number_type">Live Users</div>
          <div> {liveUsers?.length}</div>
        </div>
        <div className="users_number">
          <div className="users_number_type">24 hours Live</div>
          <div> {last24?.length}</div>
        </div>
        <div className="users_number">
          <div className="users_number_type">0 Balance Users</div>
          <div> {zeroBalanceUsers?.length}</div>
        </div>
        <div className="users_number">
          <div className="users_number_type">Dead Users</div>
          <div> {deadUsers?.length}</div>
        </div>
      </div>
      <div className="users_list">
        <div>
          <Link to="/users" className="all_users">
            See all Users
          </Link>
        </div>
        <div className="users_icon">
          <PeopleIcon />
        </div>
      </div>
    </div>
  );
};

export default UsersHome;
