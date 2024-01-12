import { useEffect, useState } from "react";
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

const UsersHome: React.FC = () => {
  const { usersData, setUsersData } = useUsersDataContext();
  const [usersListData, setUsersListData] = useState<UsersListData | null>(
    null
  );

  useEffect(() => {
    const usersListRef = ref(database, "USERS LIST");

    get(usersListRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUsersListData(snapshot.val());
        console.log(snapshot.val());
      } else {
        console.log("No data available for USERS LIST");
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

  const blockedUsers = usersData?.filter((user) => isBlocked(user.PHONE));

  const today = new Date().setHours(0, 0, 0, 0);
  const todayRegistered = usersData?.filter((user) => today < user.CREATED_ON);

  const liveThreshold = 1 * 60 * 1000; //1 min in milliseconds
  const currentTimestamp = new Date().getTime();
  const liveUsers = usersData?.filter(
    (user) => currentTimestamp - user.LAST_SEEN <= liveThreshold
  );

  const oneDayMilliseconds = 24 * 60 * 60 * 1000;
  const last24 = usersData?.filter(
    (user) => currentTimestamp - user.LAST_SEEN <= oneDayMilliseconds
  );

  const zeroBalanceUsers = usersData?.filter((user) => user.AMOUNT === 0);

  return (
    <div className="users">
      <h3 className="user_title">USERS</h3>
      <div className="different_users_details">
        <div className="users_number">
          <div className="users_number_type">Total Users </div>
          <div> {usersData?.length}</div>
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
