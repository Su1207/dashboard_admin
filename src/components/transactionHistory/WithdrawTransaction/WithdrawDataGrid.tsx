import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { WithdrawalDetails } from "../TransactionContext";
import "./WithdrawTransaction.scss";
import { Chip } from "@mui/material";

type CustomRow = WithdrawalDetails;

interface WithdrawDataGridProps {
  withdrawData: CustomRow[];
}

const WithdrawDataGrid: React.FC<WithdrawDataGridProps> = ({
  withdrawData,
}) => {
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
    { field: "payoutTo", headerName: "Payout To", width: 120 },
    { field: "app", headerName: "App", width: 120 },
    { field: "type", headerName: "Type", width: 120 },
    // { field: "uid", headerName: "UID", width: 150 },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <>
          {params.row.pending === "true" ? (
            <Chip label="pending" color="warning" />
          ) : params.row.isRejected === "true" ? (
            <Chip label="rejected" color="error" />
          ) : (
            <Chip label="Success" color="success" />
          )}
        </>
      ),
    },
    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 150,
      renderCell: (params) => (
        <>
          {params.row.isRejected === "true" ? (
            <div>{params.row.total}</div>
          ) : (
            <div>{params.row.amount + params.row.total}</div>
          )}
        </>
      ),
    },
    {
      field: "amount",
      headerName: "Points",
      width: 120,
      renderCell: (params) => (
        <div className="sub_points">-{params.row.amount}</div>
      ),
    },
    { field: "total", headerName: "Current Points", width: 150 },

    // { field: "isRejected", headerName: "Rejected", width: 120 },
  ];

  const getRowId = (row: CustomRow) => `${row.date}${row.uid}`;

  return (
    <div className="dataTable_withdraw">
      {withdrawData && withdrawData.length > 0 ? (
        <DataGrid
          className="dataGrid_withdraw"
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

export default WithdrawDataGrid;
