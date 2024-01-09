import React from "react";
import { useTransactionContext } from "../TransactionContext";
// import {
//   DepositDetails,
//   BidDetails,
//   WinDetails,
//   WithdrawalDetails,
// } from "../TransactionContext";
import "./single.scss";
import DataGridDemo from "./TransactionHistory";

const TotalTransaction: React.FC = () => {
  const { bidData, depositData, winData, withdrawData } =
    useTransactionContext();

  // Combine all data into a single array
  const totalData = [
    ...(bidData || []),
    ...(depositData || []),
    ...(winData || []),
    ...(withdrawData || []),
  ];

  console.log(totalData);

  // Sort the combined data by date in descending order
  totalData.sort((a, b) => {
    const dateA = new Date(a.date.replace("|", "")).getTime();
    const dateB = new Date(b.date.replace("|", "")).getTime();
    return dateB - dateA;
  });

  return (
    <div className="totalTransaction_detail">
      <h2>Transaction History</h2>
      <DataGridDemo totalData={totalData} />
    </div>
  );
};

export default TotalTransaction;
