import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";

// type User = {
//   NAME: string;
//   PHONE: string;
//   CREATED_ON: string;
//   LAST_SEEN: string;
//   AMOUNT: number;
//   isLoggedIn: boolean;
//   // ... other properties
// };

// type UsersData = Record<string, User>;

interface DataTableProps {
  usersData: Record<string, any> | null;
}

const DataTable: React.FC<DataTableProps> = ({ usersData }) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "name", headerName: "User Name", width: 120 },
    { field: "phone", headerName: "Phone", width: 120 },
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
            src="view.svg"
            alt=""
            onClick={() => handleEdit(params.row.id)}
          />
          <img
            src="delete.svg"
            alt=""
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (userId: string) => {
    // Implement your edit logic here
    console.log(`Edit user with ID ${userId}`);
  };

  const handleDelete = (userId: string) => {
    // Implement your delete logic here
    console.log(`Delete user with ID ${userId}`);
  };

  const rows = Object.keys(usersData || {}).map((id) => {
    const user = usersData && usersData[id];
    const createdOnDate = user?.CREATED_ON
      ? new Date(user.CREATED_ON).toLocaleString()
      : "";
    const lastSeenDate = user?.LAST_SEEN
      ? new Date(user.LAST_SEEN).toLocaleString()
      : "";

    return {
      id,
      name: user?.NAME || "",
      phone: user?.PHONE || "",
      createdOn: createdOnDate,
      lastSeen: lastSeenDate,
      amount: user?.AMOUNT || 0, // Assuming a default value for AMOUNT
      //   isLoggedIn: user?.isLoggedIn || false,
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
                pageSize: 10,
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
