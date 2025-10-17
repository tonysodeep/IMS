import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  // Clear user session data (e.g., tokens, user info)
  const navigate = useNavigate();
  const { logout } = useAuth();
  logout();
  navigate("/login");
};
export default Logout;
