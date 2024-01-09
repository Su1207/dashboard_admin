import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./DepositTransaction.scss";
import { DepositDetails } from "../TransactionContext";
import { Chip } from "@mui/material";

type CustomRow = DepositDetails;

interface DepositDataGridProps {
  depositData: CustomRow[];
}

const DepositDataGrid: React.FC<DepositDataGridProps> = ({ depositData }) => {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          <div>{params.value.split(" | ")[0]}</div>
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },

    {
      field: "paymentTo",
      headerName: "Payment To",
      width: 130,
      cellClassName: "centered-cell",
    },
    { field: "paymentApp", headerName: "Payment App", width: 130 },

    // { field: "name", headerName: "Name", width: 150 },
    { field: "paymentBy", headerName: "Payment By", width: 120 },
    // { field: "uid", headerName: "UID", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: () => <Chip label="success" color="success" />,
    },
    {
      field: "previous",
      headerName: "Previous Points",
      width: 140,
      renderCell: (params) => <div>{params.row.total - params.row.amount}</div>,
    },

    {
      field: "amount",
      headerName: "Points",
      width: 110,
      renderCell: (params) => (
        <div className="add_points">+{params.row.amount}</div>
      ),
    },
    { field: "total", headerName: "Current Points", width: 140 },
  ];

  const getRowId = (row: CustomRow) => `${row.date}${row.uid}`;

  return (
    <div className="dataTable_deposit">
      {depositData && depositData.length > 0 ? (
        <DataGrid
          className="dataGrid_deposit"
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

export default DepositDataGrid;
