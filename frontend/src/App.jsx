import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Root from "./ultis/Root";
import LoginPage from "./pages/Login";
import ProtectedRoutes from "./ultis/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Items from "./components/Item";
import Logout from "./components/Logout";
import User from "./components/User";
import CustomerProducts from "./components/CustomerProducts";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import Summary from "./components/Summary";
import Setting from "./pages/Setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route
          path="/admin-setting"
          element={
            <ProtectedRoutes requiredRole={["admin"]}>
              <Setting />
            </ProtectedRoutes>
          }
        >
          <Route path="categories" element={<Categories />}></Route>
          <Route path="items" element={<Items />}></Route>
          <Route path="suppliers" element={<Suppliers />}></Route>
        </Route>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes requiredRole={["admin"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Summary />}></Route>
          <Route path="orders" element={<Orders />}></Route>
          <Route path="users" element={<User />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="logout" element={<Logout />}></Route>
        </Route>

        <Route path="/customer-dashboard" element={<Dashboard />}>
          <Route index element={<CustomerProducts />}></Route>
          <Route path="orders" element={<Orders />}></Route>
          <Route path="logout" element={<Logout />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/unauthorized"
          element={
            <p className="font-bold text-3xl mt-20 ml-20">Unauthorized</p>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
