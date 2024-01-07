import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
import { ref, remove, update } from "firebase/database";
import { database } from "../../firebase";
import BlockUnblockToggle from "../toggleButton/BlockUnblockToggle";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// type User = {
//   NAME: string;
//   PHONE: string;
//   CREATED_ON: string;
//   LAST_SEEN: string;
//   AMOUNT: number;
//   isLoggedIn: boolean;
//   // ... other properties
// };

type User = {
  NAME: string;
  PHONE: string;
  CREATED_ON: string;
  LAST_SEEN: string;
  AMOUNT: number;
  isLoggedIn: boolean;
  // ... other properties
};

// type UsersData = Record<string, User>;

interface DataTableProps {
  usersData: Record<string, any> | User[] | null | undefined;
}

const DataTable: React.FC<DataTableProps> = ({ usersData }) => {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "Phone", width: 110 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "createdOn", headerName: "Created On", width: 200 },
    { field: "lastSeen", headerName: "Last Seen", width: 200 },
    { field: "amount", headerName: "Amount", width: 90, editable: true },

    // { field: "isLoggedIn", headerName: "Is Logged In", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <div className="actions_icons">
          <img
            style={{ cursor: "pointer" }}
            src="view.svg"
            alt=""
            onClick={() => handleEdit(params.row.id)}
          />
          <img
            style={{ cursor: "pointer" }}
            src="delete.svg"
            alt=""
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },

    {
      field: "block-unblock",
      headerName: "Status",
      width: 90,
      sortable: false,
      renderCell: (params) => <BlockUnblockToggle userId={params.row.id} />,
    },
  ];

  const handleEdit = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleDelete = (userId: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete user ${userId}?`
    );

    if (!userConfirmed) {
      // User canceled the deletion
      return;
    }
    // Reference to the specific user's ID under 'USERS' node
    const userToDeleteRef = ref(database, `USERS/${userId}`);
    const userListRef = ref(database, "USERS LIST");

    // Remove the user from the database
    remove(userToDeleteRef)
      .then(() => {
        console.log(`User ${userId} deleted successfully`);
        toast.success(`User ${userId} deleted successfully`);

        // Remove the user's ID from the 'users_list' node
        update(userListRef, {
          [userId]: null, // Set the user's ID to null to remove it
        });
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        toast.error("Error deleting user");
      });
  };

  console.log(usersData);

  const rows = Object.entries(usersData || {}).map(([id, user]) => {
    const convertTimestamp = (timestamp: string) => {
      const dateObj = new Date(timestamp);

      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = getMonthName(dateObj.getMonth());
      const year = dateObj.getFullYear();
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      const seconds = dateObj.getSeconds().toString().padStart(2, "0");
      const meridiem = hours >= 12 ? "PM" : "AM";
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

      return `${day}-${month}-${year} | ${formattedHours}:${minutes}:${seconds} ${meridiem}`;
    };

    const createdOnDate = user?.CREATED_ON
      ? convertTimestamp(user.CREATED_ON)
      : "";
    const lastSeenDate = user?.LAST_SEEN
      ? convertTimestamp(user.LAST_SEEN)
      : "";

    return {
      id: user?.PHONE || id,
      name: user?.NAME || "",
      createdOn: createdOnDate,
      lastSeen: lastSeenDate,
      amount: user?.AMOUNT || 0,
    };
  });

  function getMonthName(monthIndex: number): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  }

  return (
    <div className="dataTable">
      {rows.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[7]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DataTable;
