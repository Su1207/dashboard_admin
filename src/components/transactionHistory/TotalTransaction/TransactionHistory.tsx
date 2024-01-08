import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  DepositDetails,
  BidDetails,
  WinDetails,
  WithdrawalDetails,
} from "../TransactionContext";

type CustomRow = DepositDetails | WinDetails | BidDetails | WithdrawalDetails;

// Function to get transaction type dynamically
const getTransactionType = (row: CustomRow) => {
  if ("paymentApp" in row) {
    return "Deposit";
  } else if ("winPoints" in row) {
    return "Win";
  } else if ("previousPoints" in row) {
    return "Bid";
  } else if ("payoutTo" in row) {
    return "Withdraw";
  } else {
    return "Unknown"; // Add a default or handle appropriately
  }
};

const columns: GridColDef[] = [
  { field: "date", headerName: "Date", width: 200 },
  {
    field: "type",
    headerName: "Type",
    width: 120,
    renderCell: (params) => <span>{getTransactionType(params.row)}</span>,
  },
  {
    field: "details",
    headerName: "Details",
    width: 250,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return (
                <div className="row_details">
                  <div>New Points: {params.row.total}</div>
                  <div>Payment By: {params.row.paymentBy}</div>
                  <div>Payment App: {params.row.paymentApp}</div>
                </div>
              );
            case "Win":
              return (
                <div className="row_details">
                  <div>New Points: {params.row.winPoints}</div>
                  <div>Market Name: {params.row.marketName}</div>
                  <div>Type: {params.row.type}</div>
                </div>
              );
            case "Bid":
              return (
                <div className="row_details">
                  <div>Market Name: {params.row.marketName}</div>
                  <div>
                    New Points: {params.row.previousPoints - params.row.points}
                  </div>
                  <div>Type: {params.row.type}</div>
                </div>
              );
            case "Withdraw":
              return (
                <div className="row_details">
                  <div>New Points: {params.row.total}</div>
                  <div>App: {params.row.app}</div>
                  <div>Pending: {params.row.pending}</div>
                </div>
              );
          }
        })()}
      </>
    ),
  },
  {
    field: "points",
    headerName: "Points",
    width: 120,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return <div className="add_points">+{params.row.amount}</div>;
            case "Win":
              return <div className="add_points">+{params.row.points}</div>;
            case "Bid":
              return <div className="sub_points">-{params.row.points}</div>;
            case "Withdraw":
              return <div className="sub_points">-{params.row.amount}</div>;
          }
        })()}
      </>
    ),
  },
];

interface DataGridDemoProps {
  totalData: CustomRow[];
}

const DataGridDemo: React.FC<DataGridDemoProps> = ({ totalData }) => {
  const flatData = totalData
    .map((transaction) => {
      if ("paymentTo" in transaction) {
        // Deposit
        const depositDetails: DepositDetails = {
          paymentTo: transaction.paymentTo,
          paymentApp: transaction.paymentApp,
          amount: transaction.amount || 0, // Add default value or handle appropriately
          name: transaction.name || "", // Add default value or handle appropriately
          paymentBy: transaction.paymentBy || "", // Add default value or handle appropriately
          uid: transaction.uid,
          total: transaction.total,
          date: transaction.date || "",
        };
        return depositDetails;
      } else if ("winPoints" in transaction) {
        // Win
        const winDetails: WinDetails = {
          winPoints: transaction.winPoints,
          marketName: transaction.marketName,
          points: transaction.points,
          marketId: transaction.marketId || "", // Add default value or handle appropriately
          name: transaction.name || "", // Add default value or handle appropriately
          newPoints: transaction.newPoints || 0, // Add default value or handle appropriately
          number: transaction.number || "", // Add default value or handle appropriately
          date: transaction.date,
          openClose: transaction.openClose,
          phone: transaction.phone,
          previousPoints: transaction.previousPoints,
          type: transaction.type,
        };
        return winDetails;
      } else if ("previousPoints" in transaction) {
        // Bid
        const bidDetails: BidDetails = {
          marketName: transaction.marketName,
          previousPoints: transaction.previousPoints,
          points: transaction.points,
          date: transaction.date,
          name: transaction.name || "", // Add default value or handle appropriately
          number: transaction.number || "", // Add default value or handle appropriately
          openClose: transaction.openClose,
          type: transaction.type,
          uid: transaction.uid,
        };
        return bidDetails;
      } else if ("payoutTo" in transaction) {
        // Withdraw
        const withdrawalDetails: WithdrawalDetails = {
          app: transaction.app || "",
          total: transaction.total,
          pending: transaction.pending || "",
          amount: transaction.amount,
          date: transaction.date || "",
          name: transaction.name || "", // Add default value or handle appropriately
          payoutTo: transaction.payoutTo || "",
          type: transaction.type || "",
          uid: transaction.uid || "",
        };
        return withdrawalDetails;
      }
    })
    .filter((transaction) => transaction !== null) as CustomRow[];

  const getRowId = (row: CustomRow) => {
    // Use a combination of date and number (if it exists) as the unique identifier
    return `${row.date}${"number" in row ? row.number : ""}`;
  };
  const getRowHeight = () => {
    // Adjust the height as per your requirement
    return 80;
  };
  return (
    <div className="dataTable_transaction">
      {flatData.length > 0 ? (
        <DataGrid
          className="dataGrid_transaction"
          rows={flatData}
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
          getRowHeight={getRowHeight}
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DataGridDemo;
