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
import GameRate from "./pages/GameRate/GameRate";
import GameSettings from "./pages/GameSettings/GameSettings";
import Notification from "./pages/Notification/Notification";
import Bid from "./pages/Bid/Bid";
import BidDetails from "./pages/Bid/BidDetails";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      {isAuthenticated ? (
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
              <Outlet />
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
        path: "/users",
        element: <Users />,
      },
      {
        path: "/market",
        element: <Games />,
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
        path: "/gameRate",
        element: <GameRate />,
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
        path: "/bid/:id",
        element: <BidDetails />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <>
        <ToastContainer />
        <RouterProvider router={router} />
      </>
    </AuthProvider>
  );
}

export default App;
