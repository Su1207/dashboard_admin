import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { WinDetails } from "../TransactionContext";
import "./WinTransaction.scss";
import { GiTwoCoins } from "react-icons/gi";

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

    {
      field: "particulars",
      headerName: "Particulars",
      width: 400,
      renderCell: (params) => (
        <div className="row_details">
          Win ( {params.row.marketName} : {params.row.type} :{" "}
          {params.row.openClose} ) : {params.row.number}
        </div>
      ),
    },

    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div> {params.row.previousPoints} </div>

          <GiTwoCoins />
        </div>
      ),
    },
    {
      field: "winPoints",
      headerName: "Points",
      width: 120,
      renderCell: (params) => (
        <div className="add_points">+{params.row.winPoints}</div>
      ),
    },
    {
      field: "currentPoints",
      headerName: "Current Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.newPoints}</div>
          <GiTwoCoins />
        </div>
      ),
    },
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
