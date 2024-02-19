import ProfitLoss from "../../components/UsersHome/ProfitLoss/ProfitLoss";
// import UsersHome from "../../components/UsersHome/UsersTypeCount/UsersHome";
import { UsersDataProvider } from "../../components/UsersHome/UserContext";
import "./home.scss";
import TotalBalance from "../../components/UsersHome/TotalBalance/TotalBalance";
import { useAuth } from "../../components/auth-context";
import { Navigate } from "react-router-dom";
import { useSubAuth } from "../../components/subAdmin-authContext";
import TotalUsers from "../../components/UsersHome/TotalUsers/TotalUsers";
import TotalMarket from "../../components/UsersHome/TotalMarket/TotalMarket";
import TodayDeposit from "../../components/UsersHome/TransactionTotal/TodayDeposit/TodayDeposit";
import TodayWithdraw from "../../components/UsersHome/TransactionTotal/TodayWithdraw/TodayWithdraw";
import TodayBid from "../../components/UsersHome/TransactionTotal/TodayBid/TodayBid";
import TodayWin from "../../components/UsersHome/TransactionTotal/TodayWin/TodayWin";
import YesterDayDeposit from "../../components/UsersHome/TransactionTotal/YesterDayDeposit/YesterDayDeposit";
import YesterdayWithdraw from "../../components/UsersHome/TransactionTotal/YesterdayWithdraw/YesterdayWithdraw";
import YesterdayBid from "../../components/UsersHome/TransactionTotal/YesterdayBid/YesterdayBid";
import YesterdayWin from "../../components/UsersHome/TransactionTotal/YesterdayWin/YesterdayWin";
import YesterdayProfitLoss from "../../components/UsersHome/ProfitLoss/YesterdayProfitLoss/YesterdayProfitLoss";
import UsersHome from "../../components/UsersHome/UsersTypeCount/UsersHome";
import GamePlayUsers from "../../components/UsersHome/GamePlayUsers/GamePlayUsers";
import WithdrawReq from "../../components/UsersHome/WithdrawReq/WithdrawReq";
import DepositReq from "../../components/UsersHome/DepositReq/DepositReq";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <UsersDataProvider>
      <div className="home">
        <div className="box box2">
          <TotalUsers />
        </div>

        <div className="box box4">
          <TotalMarket />
        </div>

        <div className="box box3">
          <TotalBalance />
        </div>

        <div className="box box8">
          <ProfitLoss />
        </div>

        <div className="box box5">
          <TodayDeposit />
        </div>

        <div className="box box6">
          <TodayWithdraw />
        </div>

        <div className="box box4">
          <TodayBid />
        </div>

        <div className="box box2">
          <TodayWin />
        </div>

        <div className="box box1">
          <UsersHome />
        </div>

        {/* <div className="box box7">Box 7</div> */}

        <div className="box box9">
          <YesterdayProfitLoss />
        </div>
        <div className="box box9">
          <YesterDayDeposit />
        </div>
        <div className="box box9">
          <YesterdayWithdraw />
        </div>
        <div className="box box9">
          <YesterdayBid />
        </div>
        <div className="box box9">
          <YesterdayWin />
        </div>

        <div className="box box10">
          <GamePlayUsers />
        </div>

        <div className="box box9">
          <DepositReq />
        </div>

        <div className="box box9">
          <WithdrawReq />
        </div>
      </div>
    </UsersDataProvider>
  );
};

export default Home;
