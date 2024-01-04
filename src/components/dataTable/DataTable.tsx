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
    { field: "id", headerName: "Phone", width: 120 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "createdOn", headerName: "Created On", width: 190 },
    { field: "lastSeen", headerName: "Last Seen", width: 190 },
    { field: "amount", headerName: "Amount", width: 100, editable: true },

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

  const rows = Object.entries(usersData || {}).map(([id, user]) => {
    const createdOnDate = user?.CREATED_ON
      ? new Date(user.CREATED_ON).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "";
    const lastSeenDate = user?.LAST_SEEN
      ? new Date(user.LAST_SEEN).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "";

    return {
      id: user?.PHONE || id, // Use user?.PHONE if available, otherwise use the id
      name: user?.NAME || "",
      createdOn: createdOnDate,
      lastSeen: lastSeenDate,
      amount: user?.AMOUNT || 0,
    };
  });

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
