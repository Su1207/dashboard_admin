import ProfitLoss from "../../components/UsersHome/ProfitLoss/ProfitLoss";
import UsersHome from "../../components/UsersHome/UsersTypeCount/UsersHome";
import { UsersDataProvider } from "../../components/UsersHome/UserContext";
import "./home.scss";
import TotalBalance from "../../components/UsersHome/TotalBalance/TotalBalance";
import TransactionTotal from "../../components/UsersHome/TransactionTotal/TransactionTotal";

const Home = () => {
  return (
    <UsersDataProvider>
      <div className="home">
        <div className="box box1">
          <UsersHome />
        </div>
        <div className="box box2">
          <TotalBalance />
        </div>
        <div className="box box3">
          <ProfitLoss />
        </div>
        <div className="box box4">
          <TransactionTotal />
        </div>
        <div className="box box5">Box 5</div>
        <div className="box box6">Box 6</div>
        <div className="box box7">Box 7</div>
        <div className="box box8">Box 8</div>
        <div className="box box9">Box 9</div>
      </div>
    </UsersDataProvider>
  );
};

export default Home;
