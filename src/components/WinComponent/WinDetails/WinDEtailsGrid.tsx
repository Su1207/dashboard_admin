import { WinDetailsType } from "./WinDetails";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./WinDetails.scss";

interface WinDetailsGridType {
  winDetails: WinDetailsType[];
}

type CustomRow = WinDetailsType;

const WinDEtailsGrid: React.FC<WinDetailsGridType> = ({ winDetails }) => {
  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "User Name",
      width: 120,
      cellClassName: "userName",
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      width: 120,
      renderCell: (params) => <div>+91{params.row.phoneNumber}</div>,
    },
    {
      field: "gameName",
      headerName: "Game Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params.row.gameName} ({params.row.openClose})
        </div>
      ),
    },
    {
      field: "number",
      headerName: "Number",
      width: 120,
    },
    {
      field: "bidAmount",
      headerName: "Bid Amount",
      width: 120,
    },
    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 140,
      renderCell: (params) => <div>&#8377; {params.row.previousPoints}</div>,
    },
    {
      field: "winPoints",
      headerName: "Win Points",
      width: 120,
      cellClassName: "add_points",
      renderCell: (params) => <div>+ {params.row.winPoints}</div>,
    },
    {
      field: "newPoints",
      headerName: "New Points",
      width: 120,
      renderCell: (params) => <div>&#8377; {params.row.newPoints}</div>,
    },
  ];

  const getRowId = (row: CustomRow) => {
    return `${row.phoneNumber}-${row.number}`;
  };
  return (
    <div className="dataTable">
      {winDetails ? (
        <DataGrid
          className="dataGrid"
          rows={winDetails}
          columns={columns}
          getRowId={getRowId}
          // checkboxSelection
          //   initialState={{
          //     pagination: {
          //       paginationModel: {
          //         pageSize: 15,
          //       },
          //     },
          //   }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          //   pageSizeOptions={[15]}
          // checkboxSelection
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

export default WinDEtailsGrid;
