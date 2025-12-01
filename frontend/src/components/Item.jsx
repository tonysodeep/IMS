import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useData } from "../context/DataContext";

const Items = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { categories, suppliers } = useData();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "",
    defaultUnit: "",
    categoryId: "",
    supplierId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return items;
    return items.filter((s) => (s.name || "").toLowerCase().includes(term));
  }, [items, searchTerm]);

  const fetchItems = async () => {
    try {
      const respone = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/item/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (respone.data.success) {
        setItems(respone.data.items);
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
      console.error("Error fetching Items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [items]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      type: "",
      defaultUnit: "",
      categoryId: "",
      supplierId: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (editItem) {
      try {
        const respone = await axios.put(
          `http://localhost:25569/api/Item/${editItem}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (respone.data.success) {
          alert(respone.data.message);
          setFormData({
            code: "",
            name: "",
            type: "",
            defaultUnit: "",
            categoryId: "",
            supplierId: "",
          });
          setOpenModal(false);
          setEditItem(null);
          fetchItems();
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
    } else {
      try {
        const respone = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/item/add`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (respone.data.success) {
          alert(respone.data.message);
          setFormData({
            code: "",
            name: "",
            type: "",
            defaultUnit: "",
            categoryId: "",
            supplierId: "",
          });
          setOpenModal(false);
          fetchItems();
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
    }
  };

  const handleEdit = (item) => {
    setOpenModal(true);
    setEditItem(item._id);
    setFormData({
      code: "",
      name: "",
      type: "",
      defaultUnit: "",
      categoryId: "",
      supplierId: "",
    });
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this Item?")) {
      try {
        const response = await axios.delete(
          `http://localhost:25569/api/Item/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert(response.data.message);
          fetchItems();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert(error.response?.data?.message || "Internal server error");
      }
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Items Management</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Item..."
          value={searchTerm}
          className="border p-1 bg-white rounded px-4"
          name="searchTerm"
          onChange={(e) => {
            handleSearchChange(e.target.value);
          }}
        />
        <button
          className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Item
        </button>
      </div>
      <div>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">S NO</th>
              <th className="border border-gray-300 p-2">Item Code</th>
              <th className="border border-gray-300 p-2">Item Name</th>
              <th className="border border-gray-300 p-2">Item Type</th>
              <th className="border border-gray-300 p-2">Item Default Unit</th>
              <th className="border border-gray-300 p-2">Category Name</th>
              <th className="border border-gray-300 p-2">Supplier Name</th>
              <th className="border border-gray-300 p-2">Create At</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{item.code}</td>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{item.type}</td>
                  <td className="border border-gray-300 p-2">
                    {item.defaultUnit}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.categoryName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.supplierName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.createdAt}
                  </td>
                  <td className="border border-gray-300 p-2 flex gap-2 justify-center">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                      onClick={() => {
                        handleEdit(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                      onClick={() => {
                        handleDelete(item._id);
                      }}
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
                  No Item found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openModal && (
        <div className=" fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-xl font-bold">Add Item</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              onClick={handleCloseModal}
            >
              X
            </button>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handelSubmit}>
              <input
                type="text"
                placeholder="Item Code"
                className="border p-1 bg-white rounded px-4"
                name="code"
                onChange={handleChange}
                value={formData.code}
              />
              <input
                type="text"
                placeholder="Item Name"
                className="border p-1 bg-white rounded px-4"
                name="name"
                onChange={handleChange}
                value={formData.name}
              />
              <input
                type="text"
                placeholder="Item Type"
                className="border p-1 bg-white rounded px-4"
                name="type"
                onChange={handleChange}
                value={formData.type}
              />
              <input
                type="text"
                placeholder="Item Default Unit"
                className="border p-1 bg-white rounded px-4"
                name="defaultUnit"
                onChange={handleChange}
                value={formData.defaultUnit}
              />
              <div className="w-full border">
                <select
                  name="categoryId"
                  className="w-full p-2"
                  onChange={handleChange}
                  value={formData.categoryId}
                >
                  <option value="">Select Category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full border">
                <select
                  name="supplierId"
                  className="w-full p-2"
                  onChange={handleChange}
                  value={formData.supplierId}
                >
                  <option value="">Select Supplier</option>
                  {suppliers &&
                    suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                </select>
              </div>
              {editItem ? (
                <button className="w-full mt-2 bg-yellow-500 text-white rounded-md p-3 cursor-pointer hover:bg-amber-300">
                  Save Changes
                </button>
              ) : (
                <button className="w-full mt-2 bg-blue-500 text-white rounded-md p-3 cursor-pointer hover:bg-blue-300">
                  Add Item
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
