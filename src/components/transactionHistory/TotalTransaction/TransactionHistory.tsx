import * as React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  DepositDetails,
  BidDetails,
  WinDetails,
  WithdrawalDetails,
} from "../TransactionContext";
import Chip from "@mui/material/Chip";

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
  {
    field: "date",
    headerName: "Date",
    width: 100,
    renderCell: (params) => (
      <div>
        <div>{params.value.split(" | ")[0]}</div>
        <div>{params.value.split(" | ")[1]}</div>
      </div>
    ),
  },
  {
    field: "type",
    headerName: "Type",
    width: 80,
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
                  <div>
                    <span className="details_name">Payment To -</span>{" "}
                    {params.row.paymentTo}
                  </div>
                  <div>
                    <span className="details_name">Payment App -</span>{" "}
                    {params.row.paymentApp}
                  </div>
                  <div>
                    <span className="details_name">Payment By -</span>{" "}
                    {params.row.paymentBy}
                  </div>
                </div>
              );
            case "Win":
              return (
                <div className="row_details">
                  <div>
                    <span className="details_name">Market Name -</span>{" "}
                    {params.row.marketName}
                  </div>
                  <div>
                    <span className="details_name">Number -</span>{" "}
                    {params.row.number}
                  </div>
                  <div>
                    <span className="details_name">Type-</span>{" "}
                    {params.row.type}
                  </div>
                </div>
              );
            case "Bid":
              return (
                <div className="row_details">
                  <div>
                    <span className="details_name">Market Name -</span>{" "}
                    {params.row.marketName}
                  </div>
                  <div>
                    <span className="details_name">Number -</span>{" "}
                    {params.row.number}
                  </div>
                  <div>
                    <span className="details_name">Type -</span>{" "}
                    {params.row.type}
                  </div>
                </div>
              );
            case "Withdraw":
              return (
                <div className="row_details">
                  <div>
                    <span className="details_name">Payout To -</span>{" "}
                    {params.row.payoutTo}
                  </div>
                  <div>
                    <span className="details_name">App -</span> {params.row.app}
                  </div>
                  <div>
                    <span className="details_name">Type -</span>{" "}
                    {params.row.type}
                  </div>
                </div>
              );
          }
        })()}
      </>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return (
                <div>
                  <Chip label="success" color="success" />
                </div>
              );
            case "Win":
              return (
                <div>
                  <Chip label="success" color="success" />
                </div>
              );
            case "Bid":
              return (
                <div>
                  <Chip label="success" color="success" />
                </div>
              );
            case "Withdraw":
              return (
                <div>
                  {params.row.pending === "true" ? (
                    <Chip label="Pending" color="warning" />
                  ) : params.row.isRejected === "true" ? (
                    <Chip label="Rejected" color="error" />
                  ) : (
                    <Chip label="Success" color="success" />
                  )}
                </div>
              );
          }
        })()}
      </>
    ),
  },
  {
    field: "previousPoints",
    headerName: "Previous",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return <div>{params.row.total - params.row.amount}</div>;
            case "Win":
              return <div>{params.row.previousPoints}</div>;
            case "Bid":
              return <div>{params.row.previousPoints}</div>;
            case "Withdraw":
              return (
                <div>
                  {params.row.pending === "true" ? (
                    <div>{params.row.total}</div>
                  ) : params.row.isRejected === "true" ? (
                    <div>{params.row.total}</div>
                  ) : (
                    <div>{params.row.amount + params.row.total}</div>
                  )}
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
    sortable: false,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return <div className="add_points">+{params.row.amount}</div>;
            case "Win":
              return <div className="add_points">+{params.row.winPoints}</div>;
            case "Bid":
              return <div className="sub_points">-{params.row.points}</div>;
            case "Withdraw":
              return <div className="sub_points">-{params.row.amount}</div>;
          }
        })()}
      </>
    ),
  },
  {
    field: "currentPoints",
    headerName: "Current",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return <div>{params.row.total}</div>;
            case "Win":
              return <div>{params.row.newPoints}</div>;
            case "Bid":
              return <div>{params.row.previousPoints - params.row.points}</div>;
            case "Withdraw":
              return <div>{params.row.total}</div>;
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
          isRejected: transaction.isRejected || "",
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
