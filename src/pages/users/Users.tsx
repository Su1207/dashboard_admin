import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { get, onValue, ref } from "firebase/database";
// import DataTable from "../../components/dataTable/DataTable";
// import AddUser from "../../components/dataTable/AddUser";
import UserList from "../../components/dataTable/UserList";
import UserListDropdown from "../../components/filterOptions/UserListDropDown";
import UserFilterDropDown from "../../components/filterOptions/UseFilterDropDown";
import "./users.scss";
import { FaUserPlus } from "react-icons/fa6";
import AddUser from "../../components/AddUser/AddUser";
import { useAuth } from "../../components/auth-context";
import { Navigate } from "react-router-dom";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";

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

type UsersTransactionData = Set<string>;

type UsersListData = Record<string, boolean>;

const Users: React.FC = () => {
  const [usersData, setUsersData] = useState<
    Record<string, User> | User[] | null
  >(null);
  const [addUser, setAddUser] = useState(false);
  const [filterOption, setFilterOption] = useState("lastSeen"); // Default filter option
  const [selectedListOption, setSelectedListOption] = useState("total"); // Default list option

  // const [blockedUser,setBlockedUser] = useState(null);
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

  const isBlocked = (userId: string) => {
    // Check the blocked status from the 'USERS LIST' node
    return usersListData?.[userId] === false;
  };

  const isDead = (userId: string) => {
    return !usersTransactionData?.has(userId) ?? true;
  };

  useEffect(() => {
    const usersRef = ref(database, "USERS");

    // Fetch data once
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUsersData(snapshot.val());
      } else {
        console.log("No data available");
      }
    });

    // Alternatively, fetch data in real-time
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        setUsersData(snapshot.val());
      } else {
        console.log("No data available");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Run effect only once on component mount

  const handleClick = () => {
    setAddUser(!addUser);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOptionChange = (value: string) => {
    setFilterOption(value);
  };

  const handleListOptionChange = (value: string) => {
    setSelectedListOption(value);
  };

  // Filter users based on selected option
  const getFilteredUsers = () => {
    if (usersData === null || usersListData === null) {
      return null;
    }

    const currentTimestamp = new Date().getTime();
    const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Subtract 24 hours in milliseconds

    switch (selectedListOption) {
      case "blocked":
        // Filter users based on the blocked status
        return Object.values(usersData).filter((user) => isBlocked(user.PHONE));

      case "today":
        // Filter users created today
        return Object.values(usersData).filter((user) =>
          isSameDay(user.CREATED_ON, currentTimestamp)
        );

      case "last24":
        // Filter users where "lastSeen" is within the last 24 hours
        return Object.values(usersData).filter(
          (user) => currentTimestamp - user.LAST_SEEN <= oneDayMilliseconds
        );

      case "0balance":
        return Object.values(usersData).filter((user) => user.AMOUNT === 0);

      case "live":
        // Filter users who have been seen in the last 1 minutes (adjust as needed)
        const liveThreshold = 1 * 60 * 1000; // 1 minutes in milliseconds
        return Object.values(usersData).filter(
          (user) => currentTimestamp - user.LAST_SEEN <= liveThreshold
        );

      case "dead":
        console.log(
          Object.values(usersData).filter((user) => isDead(user.PHONE))
        );
        return Object.values(usersData).filter((user) => isDead(user.PHONE));

      // Add cases for other options
      default:
        // Default case: Return all users
        return usersData;
    }
  };

  // Helper function to check if two timestamps are on the same day
  const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();
  // const { username, setUsername } = usePermissionContext();

  // useEffect(() => {
  //   const fetchPermissions = async () => {
  //     const userString = localStorage.getItem("user");
  //     if (userString !== null) {
  //       const user = await JSON.parse(userString);
  //       setUsername(user.ID);
  //     }
  //     if (!username) return;

  //     const permissionRef = ref(
  //       database,
  //       `ADMIN/SUB_ADMIN/${username}/PERMISSIONS`
  //     );

  //     const permissionSnapshot = await get(permissionRef);
  //     if (permissionSnapshot.exists()) {
  //       setPermissions(permissionSnapshot.val());
  //     }
  //   };

  //   fetchPermissions();
  // }, [username]);

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {isAuthenticated || (isSubAuthenticated && permissions?.USERS) ? (
        <div className="users">
          <div className="users_heading">
            <h1>Users</h1>
            <div className="users_heading_options">
              <div onClick={handleClick} className="add_user_option">
                {!addUser && <FaUserPlus size={25} />}
              </div>

              {/* User List Dropdown */}
              <div>
                <UserListDropdown
                  selectedListOption={selectedListOption}
                  onListOptionChange={handleListOptionChange}
                />
              </div>

              {/* User Filter Dropdown */}
              <div>
                <UserFilterDropDown
                  filterOption={filterOption}
                  onFilterOptionChange={handleOptionChange}
                />
              </div>
            </div>
          </div>

          {addUser && (
            <div>
              <AddUser setAddUser={setAddUser} />
            </div>
          )}

          {/* Display the UserList component with the usersData and filterOption */}
          <UserList
            usersData={getFilteredUsers()}
            filterOption={filterOption}
          />
          {/* <ul>
        {usersData &&
          Object.entries(usersData).map(([userId, user]) => (
            <li key={userId}>
              <p>ID: {userId}</p>
              <p>Name: {user.NAME}</p>
              <p>Phone: {user.PHONE}</p>
            </li>
          ))}
      </ul> */}
        </div>
      ) : (
        <p>No access to this data</p>
      )}
    </>
  );
};

export default Users;
