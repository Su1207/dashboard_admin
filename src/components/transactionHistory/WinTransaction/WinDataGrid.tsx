import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { WinDetails } from "../TransactionContext";
import "./WinTransaction.scss";
import { Chip } from "@mui/material";

type CustomRow = WinDetails;

interface WinDataGridProps {
  winData: CustomRow[];
}

const WinDataGrid: React.FC<WinDataGridProps> = ({ winData }) => {
  //   const rows = winData.map((winDataNode) => {
  //     const winDetails: WinDetails = {
  //       winPoints: winDataNode.winPoints,
  //       marketName: winDataNode.marketName,
  //       points: winDataNode.points,
  //       marketId: winDataNode.marketId || "", // Add default value or handle appropriately
  //       name: winDataNode.name || "", // Add default value or handle appropriately
  //       newPoints: winDataNode.newPoints || 0, // Add default value or handle appropriately
  //       number: winDataNode.number || "", // Add default value or handle appropriately
  //       date: winDataNode.date,
  //       openClose: winDataNode.openClose,
  //       phone: winDataNode.phone,
  //       previousPoints: winDataNode.previousPoints,
  //       type: winDataNode.type,
  //     };
  //     return winDetails;
  //   });

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 100,
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          <div>{params.value.split(" | ")[0]}</div>
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
    // { field: "points", headerName: "Points", width: 80 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: () => <Chip label="success" color="success" />,
    },
    { field: "previousPoints", headerName: "Previous Points", width: 150 },
    {
      field: "winPoints",
      headerName: "Points",
      width: 120,
      renderCell: (params) => (
        <div className="add_points">+{params.row.winPoints}</div>
      ),
    },
    { field: "currentPoints", headerName: "Current Points", width: 150 },
  ];

  const getRowId = (row: CustomRow) => `${row.date}${row.number}`;

  return (
    <div className="dataTable_win">
      {winData && winData.length > 0 ? (
        <DataGrid
          className="dataGrid_win"
          rows={winData}
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

export default WinDataGrid;
