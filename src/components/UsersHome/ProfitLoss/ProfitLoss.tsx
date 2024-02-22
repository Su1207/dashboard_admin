import { useState, useEffect } from "react";
import { useUsersDataContext } from "../UserContext";
import "./ProfitLoss.scss";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

const ProfitLoss = () => {
  const { totalBid, totalWin } = useUsersDataContext();
  const [profit, setProfit] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState(0);

  useEffect(() => {
    const calculateProfit = () => {
      const value = totalBid - totalWin;

      if (value > 0) {
        setProfit(true);
      } else if (value < 0) {
        setProfit(false);
      }

      setCalculatedValue(Math.abs(value));
    };

    // Call the function when the component mounts or when totalDeposit or totalWithdraw changes
    calculateProfit();
  }, [totalBid, totalWin]);

  return (
    <div className="profit_loss_container">
      <h3 className="profit_loss_title">Profit / Loss</h3>

      <div className="profit">&#8377; {calculatedValue}</div>

      {profit ? (
        <div className="profit_icon">
          <KeyboardDoubleArrowUpRoundedIcon style={{ fontSize: "2rem" }} />
        </div>
      ) : !profit && calculatedValue !== 0 ? (
        <div className="loss_icon">
          <KeyboardDoubleArrowDownRoundedIcon style={{ fontSize: "2rem" }} />
        </div>
      ) : (
        <div className="neutral_icon">
          <RemoveCircleRoundedIcon />
        </div>
      )}
    </div>
  );
};

export default ProfitLoss;
