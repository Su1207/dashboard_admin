import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { BidDetails } from "../TransactionContext";
import "./BidTransaction.scss";

type CustomRow = BidDetails;

interface BidDataGridProps {
  bidData: CustomRow[];
}

const BidDataGrid: React.FC<BidDataGridProps> = ({ bidData }) => {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div>
          <div>{params.value.split(" | ")[0]}</div>{" "}
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },
    // { field: "marketId", headerName: "Market ID", width: 150 },
    { field: "marketName", headerName: "Market Name", width: 120 },
    // { field: "name", headerName: "Name", width: 150 },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.type}:{params.row.openClose}
        </div>
      ),
    },

    { field: "number", headerName: "Number", width: 100 },

    { field: "previousPoints", headerName: "Previous Points", width: 160 },
    {
      field: "points",
      headerName: "Points",
      width: 100,
      renderCell: (params) => (
        <div className="sub_points">-{params.row.points}</div>
      ),
    },
    {
      field: "currentPoints",
      headerName: "Current Points",
      width: 150,
      renderCell: (params) => (
        <div>{params.row.previousPoints - params.row.points}</div>
      ),
    },
  ];

  const getRowId = (row: CustomRow) => `${row.date}${row.number}`;

  return (
    <div className="dataTable_bid">
      {bidData && bidData.length > 0 ? (
        <DataGrid
          className="dataGrid_bid"
          rows={bidData}
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
          //   checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          getRowId={getRowId}
        />
      ) : (
        <p>No Data Available</p>
      )}
    </div>
  );
};

export default BidDataGrid;
