import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Users from "./pages/users/Users";
import Games from "./pages/games/Games";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import User from "./pages/user/User";
import Game from "./pages/game/Game";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TemporaryDrawer from "./components/menu/TemporaryDrawer";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";
import { AuthProvider, useAuth } from "./components/auth-context";
import { SubAuthProvider, useSubAuth } from "./components/subAdmin-authContext";
import GameRate from "./pages/GameRate/GameRate";
import GameSettings from "./pages/GameSettings/GameSettings";
import Notification from "./pages/Notification/Notification";
import Bid from "./pages/Bid/Bid";
import BidDetails from "./pages/Bid/BidDetails";
import Win from "./pages/Win/Win";
import WinDetail from "./pages/Win/WinDetail";
import { BidComponentProvider } from "./components/BidComponent/BidComponentContext";
import Payout from "./pages/Payout/Payout";
import Settings from "./pages/Settings/Settings";
import ManualRequest from "./pages/ManualRequest/ManualRequest";
import Rewards from "./pages/games/Rewards/Rewards";
import { PermissionProvider } from "./components/subAdminPermission";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminRoles from "./pages/AdminUsers/AdminRoles/AdminRoles";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();
  console.log(isSubAuthenticated);
  return (
    <div>
      {isAuthenticated || isSubAuthenticated ? (
        <div className="main">
          <div className="main_navbar">
            <div className="menu_drawer">
              <TemporaryDrawer />
            </div>
            <Navbar />
          </div>
          <div className="container">
            <div className="menuContainer">
              <Menu />
            </div>
            <div className="contentContainer">
              <BidComponentProvider>
                <Outlet />
              </BidComponentProvider>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </div>
      ) : (
        // Render only the login page when not authenticated
        <Login />
      )}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/payout",
        element: <Payout />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/market",
        element: <Games />,
      },
      {
        path: "/rewards/:id",
        element: <Rewards />,
      },
      {
        path: "/users/:id",
        element: <User />,
      },
      {
        path: "/games/:id",
        element: <Game />,
      },
      {
        path: "/deposit",
        element: <Deposit />,
      },
      {
        path: "/withdraw",
        element: <Withdraw />,
      },
      {
        path: "/bid",
        element: <Bid />,
      },
      {
        path: "/win",
        element: <Win />,
      },
      {
        path: "/gameRate",
        element: <GameRate />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/gameSettings",
        element: <GameSettings />,
      },
      {
        path: "/notifications",
        element: <Notification />,
      },
      {
        path: "/manualRequest",
        element: <ManualRequest />,
      },
      {
        path: "/bid/:id",
        element: <BidDetails />,
      },
      {
        path: "/win/:id",
        element: <WinDetail />,
      },
      {
        path: "/subAdmin",
        element: <AdminUsers />,
      },
      {
        path: "/subAdmin/:id",
        element: <AdminRoles />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <SubAuthProvider>
          <PermissionProvider>
            <>
              <ToastContainer />
              <RouterProvider router={router} />
            </>
          </PermissionProvider>
        </SubAuthProvider>
      </AuthProvider>
    </>
  );
}

export default App;
