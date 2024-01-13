import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { UserDeposit } from "./UsersDepositData";
import "./UsersDepositData.scss";

interface UserDepositDataProps {
  depositData: CustomRow[] | null;
}

type CustomRow = UserDeposit;

const UserDepositGrid: React.FC<UserDepositDataProps> = ({ depositData }) => {
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
      renderCell: (params) => (
        <div>
          <div>{params.row.NAME}</div>
        </div>
      ),
    },
    {
      field: "AMOUNT",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => (
        <div>
          <div className="add_points">+ {params.row.AMOUNT}</div>
        </div>
      ),
    },
    {
      field: "PAYMENT_BY",
      headerName: "Payment By",
      width: 140,
    },
    {
      field: "PAYMENT_APP",
      headerName: "Payment App",
      width: 140,
    },
    {
      field: "PAYMENT_TO",
      headerName: "Payment To",
      width: 140,
    },
    {
      field: "TOTAL",
      headerName: "Total",
      width: 120,
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
    <div className="dataTable_Usersdeposit">
      {depositData && depositData.length > 0 ? (
        <DataGrid
          className="dataGrid_Usersdeposit"
          rows={depositData}
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
          disableRowSelectionOnClick
          //   disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          getRowId={getRowId}
        />
      ) : (
        <p>No Data Available for the day</p>
      )}
    </div>
  );
};

export default UserDepositGrid;
