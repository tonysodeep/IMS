import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [edit, setEdit] = useState(false);

  const fetchUser = async () => {
    try {
      const respone = await axios.get(
        "http://localhost:25569/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (respone.data.success) {
        setUser({
          name: respone.data.user.name,
          email: respone.data.user.email,
          address: respone.data.user.address,
        });
      } else {
        alert(respone.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Internal server error");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reponse = await axios.put(
        "http://localhost:25569/api/user/profile",
        user,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );
      if (reponse.data.success) {
        alert(reponse.data.message);
        fetchUser();
        setEdit(false);
      } else {
        alert(reponse.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Internal server error");
      }
    }
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-md"
      >
        <h2 className="font-bold text-2xl">User Profile</h2>
        <div className="mb-4 mt-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username:
          </label>
          <input
            type="text"
            name="name"
            disabled={!edit}
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50"
          />
        </div>
        <div className="mb-4 mt-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            disabled={!edit}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50"
          />
        </div>
        <div className="mb-4 mt-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address:
          </label>
          <input
            type="text"
            name="address"
            disabled={!edit}
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50"
          />
        </div>
        {edit && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password (Option)"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50"
            />
          </div>
        )}
        {!edit ? (
          <button
            className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-300"
            type="button"
            onClick={() => setEdit(!edit)}
          >
            Update User
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-500 cursor-pointer"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEdit(!edit)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ml-2 cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Profile;
