import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { UserWithdraw } from "./UsersWithdrawData";
import "./UsersWithdrawData.scss";

interface withdrawDataGridProps {
  withdrawData: CustomRow[] | null;
}

type CustomRow = UserWithdraw;

const UsersWithdrawGrid: React.FC<withdrawDataGridProps> = ({
  withdrawData,
}) => {
  const columns: GridColDef[] = [
    {
      field: "DATE",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div>
          <div>{params.value.split(" | ")[0]}</div>
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },
    {
      field: "NAME",
      headerName: "Name",
      width: 120,
      cellClassName: "bidPhone_column",
      renderCell: (params) => (
        <div>
          <div className="user_name">{params.row.NAME}</div>
          <div>{params.row.userPhone}</div>
        </div>
      ),
    },

    {
      field: "APP",
      headerName: "App",
      width: 120,
    },
    {
      field: "PAYOUT_TO",
      headerName: "Payout To",
      width: 120,
    },
    {
      field: "TYPE",
      headerName: "Type",
      width: 120,
    },
    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 140,
      renderCell: (params) => (
        <div>
          <div>&#8377; {params.row.AMOUNT + params.row.TOTAL}</div>
        </div>
      ),
    },
    {
      field: "AMOUNT",
      headerName: "Wihthdraw",
      width: 120,
      renderCell: (params) => (
        <div>
          <div className="sub_points">- {params.row.AMOUNT}</div>
        </div>
      ),
    },
    {
      field: "TOTAL",
      headerName: "Current Points",
      width: 140,
      renderCell: (params) => (
        <div>
          <div>&#8377; {params.row.TOTAL}</div>
        </div>
      ),
    },
  ];

  const getRowId = (row: CustomRow) => {
    return `${row.DATE}${row.userPhone}`;
  };

  return (
    <div className="dataTable_UsersWithdraw">
      {withdrawData && withdrawData.length > 0 ? (
        <DataGrid
          className="dataGrid_UsersWithdraw"
          rows={withdrawData}
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
              quickFilterProps: {
                debounceMs: 500,
                placeholder: "Search by Name", // Set your custom placeholder here
              },
            },
          }}
          pageSizeOptions={[7]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          getRowId={getRowId}
        />
      ) : (
        <div className="no-data">
          <img src="/noData.gif" alt="" className="no-data-img" />
        </div>
      )}
    </div>
  );
};

export default UsersWithdrawGrid;
