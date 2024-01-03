import React, { useMemo } from "react";
import DataTable from "./DataTable";

interface UserListProps {
  usersData: Record<string, any> | null | undefined;
  filterOption: string;
}

const UserList: React.FC<UserListProps> = ({ usersData, filterOption }) => {
  // Sorting function based on last_seen timestamp in descending order
  const sortByLastSeen = (users: any[]) => {
    return users.sort((a, b) => b.LAST_SEEN - a.LAST_SEEN);
  };

  // Sorting function based on alphabetical order of user names
  const sortAlphabetically = (users: any[]) => {
    return users.sort((a, b) => a.NAME.localeCompare(b.NAME));
  };

  // Sorting function based on amount in ascending order
  const sortByAmount = (users: any[]) => {
    return users.sort((a, b) => b.AMOUNT - a.AMOUNT);
  };

  // Sorting function based on versions (assuming there is a property named "version")
  const sortByVersions = (users: any[]) => {
    return users.sort((a, b) => b.APP_VERSION - a.APP_VERSION);
  };

  // Memoize the sorting function based on the selected filter option
  const sortedUsers = useMemo(() => {
    switch (filterOption) {
      case "lastSeen":
        return sortByLastSeen(Object.values(usersData || {}));
      case "alphabetical":
        return sortAlphabetically(Object.values(usersData || {}));
      case "amount":
        return sortByAmount(Object.values(usersData || {}));
      case "versions":
        return sortByVersions(Object.values(usersData || {}));
      default:
        return sortByLastSeen(Object.values(usersData || {}));
    }
  }, [filterOption, usersData]);

  return (
    <div>{sortedUsers !== null && <DataTable usersData={sortedUsers} />}</div>
  );
};

export default UserList;
