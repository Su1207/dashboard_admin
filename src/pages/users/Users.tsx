import { useEffect, useState } from "react";
import "./users.scss";
import { database } from "../../firebase";
import { get, onValue, ref } from "firebase/database";
import DataTable from "../../components/dataTable/DataTable";

const Users = () => {
  const [usersData, setUsersData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // Reference to the 'users' node in the database
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

  // Render your component UI with the fetched data
  return (
    <div>
      <h1>Users</h1>
      <button>Add new user</button>
      {usersData !== null && <DataTable usersData={usersData} />}
    </div>
  );
};

export default Users;
