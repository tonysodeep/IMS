import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Root from "./ultis/Root";
import LoginPage from "./pages/Login";
import ProtectedRoutes from "./ultis/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoutes requiredRole={["admin"]}>
              <h1> admin dashboard</h1>
            </ProtectedRoutes>
          }
        />
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
