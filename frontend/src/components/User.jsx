import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const User = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return users;
    return users.filter((s) => (s.name || "").toLowerCase().includes(term));
  }, [users, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const respone = await axios.get("http://localhost:25569/api/user/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (respone.data.success) {
        setUsers(respone.data.users);
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
    } finally {
      setLoading(false);
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const reponse = await axios.post(
        "http://localhost:25569/api/user/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );
      if (reponse.data.success) {
        alert(reponse.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "",
        });
        fetchUsers();
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

  const hanleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this User?")) {
      try {
        const response = await axios.delete(
          `http://localhost:25569/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert(response.data.message);
          fetchUsers();
        }
      } catch (error) {
        console.error("Error deleting User:", error);
        alert(error.response?.data?.message || "Internal server error");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  if (loading) return <div> Loadding ... </div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">User Managment</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-bold mb-4">Add User</h2>
            <form className="space-y-4" onSubmit={handelSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  className="border w-full p-2 rounded-md"
                  placeholder="User Name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  name="email"
                  className="border w-full p-2 rounded-md"
                  placeholder="Enter Email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="password"
                  value={formData.password}
                  name="password"
                  className="border w-full p-2 rounded-md"
                  placeholder="Enter Password"
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address}
                  name="address"
                  className="border w-full p-2 rounded-md"
                  placeholder="Enter Address"
                  onChange={handleChange}
                />
              </div>
              <div>
                <select
                  name="role"
                  className="border w-full p-2 rounded-md"
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-300"
                  type="submit"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="lg:w-2/3">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            className="p-2 bg-white w-full mb-4 rounded"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">No.</th>
                  <th className="border border-gray-200 p-2">Name</th>
                  <th className="border border-gray-200 p-2">Email</th>
                  <th className="border border-gray-200 p-2">Address</th>
                  <th className="border border-gray-200 p-2">Role</th>
                  <th className="border border-gray-200 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id || index}>
                      <td className="border border-gray-200 p-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.name}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.email}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.address}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.role}
                      </td>
                      <td className="border border-gray-200 p-2 flex gap-2 justify-center">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-300"
                          onClick={() => hanleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="border border-gray-300 p-2 text-center"
                      colSpan={6}
                    >
                      No User found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
