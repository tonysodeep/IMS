import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Root from "./ultis/Root";
import LoginPage from "./pages/Login";
import ProtectedRoutes from "./ultis/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Products from "./components/Products";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes requiredRole={["admin"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<h1> Summary dasboardk</h1>}></Route>
          <Route path="categories" element={<Categories />}></Route>
          <Route path="products" element={<Products />}></Route>
          <Route path="suppliers" element={<Suppliers />}></Route>
          <Route path="orders" element={<h1> Categories dashboard</h1>}></Route>
          <Route path="users" element={<h1> Categories dashboard</h1>}></Route>
        </Route>

        <Route
          path="/customer/dashboard"
          element={<h1>Customer Dashboard</h1>}
        />
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
