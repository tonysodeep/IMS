import { Outlet } from "react-router";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Setting = () => {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16 md:ml-64 bg-gray-100 min-h-screen">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Setting;
