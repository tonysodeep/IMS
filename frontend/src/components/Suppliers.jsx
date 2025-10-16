import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";

const Suppliers = () => {
  const [addEditSupplier, setAddEditSupplier] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierEmail: "",
    supplierPhoneNumber: "",
    supplierAddress: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const { suppliers, fetchSuppliers, loadingSuppliers } = useData();

  const filteredSuppliers = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return suppliers;
    return suppliers.filter((s) => (s.name || "").toLowerCase().includes(term));
  }, [suppliers, searchTerm]);

  const hanleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      try {
        const reponse = await axios.put(
          `http://localhost:25569/api/supplier/${addEditSupplier}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (reponse.data.success) {
          fetchSuppliers();
          alert("Supplier updated successfully");
          setAddEditSupplier(null);
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
      } finally {
        setFormData({
          supplierName: "",
          supplierEmail: "",
          supplierPhoneNumber: "",
          supplierAddress: "",
        });
      }
    } else {
      try {
        const reponse = await axios.post(
          "http://localhost:25569/api/supplier/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (reponse.data.success) {
          alert("Supplier added successfully");
          fetchSuppliers();
          setAddEditSupplier(null);
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
      } finally {
        setFormData({
          supplierName: "",
          supplierEmail: "",
          supplierPhoneNumber: "",
          supplierAddress: "",
        });
      }
    }
  };

  useEffect(() => {
    // sync component loading with data context
    setLoading(loadingSuppliers);
    // ensure filteredSuppliers recalculates from context suppliers via useMemo
  }, [loadingSuppliers, suppliers]);

  const handleEditSupplier = (supplier) => {
    setFormData({
      supplierName: supplier.name,
      supplierEmail: supplier.email,
      supplierPhoneNumber: supplier.phoneNumber,
      supplierAddress: supplier.address,
    });
    setAddEditSupplier(supplier._id);
    setIsEditMode(true);
  };

  const handleAddEditDialog = (type) => {
    switch (type) {
      case "add-supplier":
        setAddEditSupplier(1);
        setIsEditMode(false);
        break;
      case "close":
        setAddEditSupplier(null);
        setFormData({
          supplierName: "",
          supplierEmail: "",
          supplierPhoneNumber: "",
          supplierAddress: "",
        });
        break;
      default:
        setAddEditSupplier(null);
        setFormData({
          supplierName: "",
          supplierEmail: "",
          supplierPhoneNumber: "",
          supplierAddress: "",
        });
        break;
    }
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm("Are you sure you want to delete this Supplier?")) {
      try {
        const response = await axios.delete(
          `http://localhost:25569/api/supplier/${supplierId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Supplier deleted successfully");
          fetchSuppliers();
        }
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert(error.response?.data?.message || "Internal server error");
      }
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Supplier Management</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Supplier..."
          value={searchTerm}
          className="border p-1 bg-white rounded px-4"
          name="searchTerm"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <button
          className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer"
          onClick={() => handleAddEditDialog("add-supplier")}
        >
          Add Supplier
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">S NO</th>
              <th className="border border-gray-300 p-2">Supplier Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone Number</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id || index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {supplier.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {supplier.email}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {supplier.phoneNumber}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {supplier.address}
                  </td>
                  <td className="border border-gray-300 p-2 flex gap-2 justify-center">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                      onClick={() => handleEditSupplier(supplier)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                      onClick={() => handleDelete(supplier._id)}
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
                  No supplier found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {addEditSupplier && (
        <div className=" fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            {isEditMode ? (
              <h1 className="text-xl font-bold">Edit Supplier</h1>
            ) : (
              <h1 className="text-xl font-bold">Add Supplier</h1>
            )}
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              onClick={() => handleAddEditDialog("close")}
            >
              X
            </button>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Supplier Name"
                className="border p-1 bg-white rounded px-4"
                name="supplierName"
                onChange={hanleChange}
                value={formData.supplierName}
              />
              <input
                type="email"
                placeholder="Supplier Email"
                className="border p-1 bg-white rounded px-4"
                name="supplierEmail"
                onChange={hanleChange}
                value={formData.supplierEmail}
              />
              <input
                type="number"
                placeholder="Supplier Phone Number"
                className="border p-1 bg-white rounded px-4"
                name="supplierPhoneNumber"
                onChange={hanleChange}
                value={formData.supplierPhoneNumber}
              />
              <input
                type="text"
                placeholder="Supplier address"
                className="border p-1 bg-white rounded px-4"
                name="supplierAddress"
                onChange={hanleChange}
                value={formData.supplierAddress}
              />
              {isEditMode ? (
                <div className="flex space-x-2">
                  <button
                    className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-300"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-300"
                    onClick={() => handleEditSupplier("close")}
                  >
                    Cancel Edit
                  </button>
                </div>
              ) : (
                <button className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer">
                  Add Supplier
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
