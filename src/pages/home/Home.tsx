import ProfitLoss from "../../components/UsersHome/ProfitLoss/ProfitLoss";
// import UsersHome from "../../components/UsersHome/UsersTypeCount/UsersHome";
import { UsersDataProvider } from "../../components/UsersHome/UserContext";
import "./home.scss";
import TotalBalance from "../../components/UsersHome/TotalBalance/TotalBalance";
import { useAuth } from "../../components/auth-context";
import { Navigate } from "react-router-dom";
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
import { UsersPermissions } from "../../components/AdmissionPermission";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { onValue, ref } from "firebase/database";

const Home = () => {
  const { isAuthenticated, isSubAuthenticated, user } = useAuth();
  const [permissions, setPermissions] = useState<UsersPermissions | null>(null);

  useEffect(() => {
    if (isSubAuthenticated)
      try {
        const permissionRef = ref(
          database,
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS`
        );

        const unsub = onValue(permissionRef, (snapshot) => {
          if (snapshot.exists()) {
            setPermissions(snapshot.val());
          }
        });

        return () => unsub();
      } catch (err) {
        console.log(err);
      }
  }, []);

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  console.log(permissions, isSubAuthenticated, isAuthenticated);
  return (
    <UsersDataProvider>
      <div className="home">
        {(isSubAuthenticated && permissions?.USERS) || isAuthenticated ? (
          <div className="box box2">
            <TotalUsers />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated && permissions?.MARKET) || isAuthenticated ? (
          <div className="box box4">
            <TotalMarket />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated &&
          permissions?.BID &&
          permissions.WIN &&
          permissions.DEPOSIT &&
          permissions.WITHDRAW) ||
        isAuthenticated ? (
          <div className="box box3">
            <TotalBalance />
          </div>
        ) : (
          ""
        )}

        {isAuthenticated ||
        (isSubAuthenticated && permissions?.BID && permissions.WIN) ? (
          <div className="box box8">
            <ProfitLoss />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated && permissions?.DEPOSIT) || isAuthenticated ? (
          <div className="box box5">
            <TodayDeposit />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated && permissions?.WITHDRAW) || isAuthenticated ? (
          <div className="box box6">
            <TodayWithdraw />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated && permissions?.BID) || isAuthenticated ? (
          <div className="box box4">
            <TodayBid />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated && permissions?.WIN) || isAuthenticated ? (
          <div className="box box2">
            <TodayWin />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated && permissions?.USERS) || isAuthenticated ? (
          <div className="box box1">
            <UsersHome />
          </div>
        ) : (
          ""
        )}

        {/* <div className="box box7">Box 7</div> */}

        {isAuthenticated ||
        (isSubAuthenticated && permissions?.BID && permissions.WIN) ? (
          <div className="box box9">
            <YesterdayProfitLoss />
          </div>
        ) : (
          ""
        )}

        {isAuthenticated || (isSubAuthenticated && permissions?.DEPOSIT) ? (
          <div className="box box9">
            <YesterDayDeposit />
          </div>
        ) : (
          ""
        )}

        {(isSubAuthenticated && permissions?.WITHDRAW) || isAuthenticated ? (
          <div className="box box9">
            <YesterdayWithdraw />
          </div>
        ) : (
          ""
        )}

        {isAuthenticated || (isSubAuthenticated && permissions?.BID) ? (
          <div className="box box9">
            <YesterdayBid />
          </div>
        ) : (
          ""
        )}

        {isAuthenticated || (isSubAuthenticated && permissions?.WIN) ? (
          <div className="box box9">
            <YesterdayWin />
          </div>
        ) : (
          ""
        )}

        <div className="box box10">
          <GamePlayUsers />
        </div>

        {isAuthenticated ||
        (isSubAuthenticated && permissions?.MANUAL_REQUEST) ? (
          <div className="box box9">
            <DepositReq />
          </div>
        ) : (
          ""
        )}

        {isAuthenticated || (isSubAuthenticated && permissions?.WITHDRAW) ? (
          <div className="box box9">
            <WithdrawReq />
          </div>
        ) : (
          ""
        )}
      </div>
    </UsersDataProvider>
  );
};

export default Home;
