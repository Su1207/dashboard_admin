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
      {/* <h2>Transaction History</h2>
      {totalData.length > 0 ? (
        <div className="table-container">
          <table>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>

            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {totalData.map((transaction, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="rowData">{transaction.date}</td>
                    <td className="rowData">
                      {"paymentTo" in transaction
                        ? "Deposit"
                        : "winPoints" in transaction
                        ? "Win"
                        : "openClose" in transaction &&
                          "number" in transaction &&
                          !("winPoints" in transaction)
                        ? "Bid"
                        : "payoutTo" in transaction
                        ? "Withdraw"
                        : ""}
                    </td>
                    <td className="rowData">
                      {(() => {
                        switch (true) {
                          case "paymentTo" in transaction:
                            return (
                              <>
                                <div>
                                  Total: {(transaction as DepositDetails).total}
                                </div>
                                <div>
                                  Payment By:{" "}
                                  {(transaction as DepositDetails).paymentTo}
                                </div>
                                <div>
                                  Payment App:{" "}
                                  {(transaction as DepositDetails).paymentApp}
                                </div>
                              </>
                            );
                          case "winPoints" in transaction:
                            return (
                              <>
                                <div>
                                  New Points:{" "}
                                  {(transaction as WinDetails).winPoints}
                                </div>
                                <div>
                                  Market Name:{" "}
                                  {(transaction as WinDetails).marketName}
                                </div>
                                <div>
                                  Type: {(transaction as WinDetails).type}
                                </div>
                              </>
                            );
                          case "openClose" in transaction:
                            return (
                              <>
                                <div>
                                  Market Name:{" "}
                                  {(transaction as BidDetails).marketName}
                                </div>

                                <div>
                                  Type:{" "}
                                  {(transaction as BidDetails).previousPoints -
                                    (transaction as BidDetails).points}
                                </div>
                                <div>
                                  Points: {(transaction as BidDetails).type}
                                </div>
                              </>
                            );
                          case "payoutTo" in transaction:
                            return (
                              <>
                                <div>
                                  App: {(transaction as WithdrawalDetails).app}
                                </div>
                                <div>
                                  Total:{" "}
                                  {(transaction as WithdrawalDetails).total}
                                </div>
                                <div>
                                  Pending:{" "}
                                  {(transaction as WithdrawalDetails).pending}
                                </div>
                              </>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </td>
                    <td className="rowData">
                      {"points" in transaction
                        ? "points" in transaction && (transaction as any).points
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <hr />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading transaction history...</p>
      )} */}
    </div>
  );
};

export default TotalTransaction;
