// components/Layout.tsx
import {
  //   createBrowserRouter,
  Outlet,
  //   Navigate,
  //   RouterProvider,
} from "react-router-dom";
import TemporaryDrawer from "./components/menu/TemporaryDrawer";
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import Footer from "./components/footer/Footer";

const Layout = () => {
  // This part remains unchanged based on your original code
  return (
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
  );
};

export default Layout;
