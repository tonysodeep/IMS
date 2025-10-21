import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const Products = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productStock: "",
    category: "",
    supplier: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) return products;
    return products.filter((s) => (s.name || "").toLowerCase().includes(term));
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const respone = await axios.get("http://localhost:25569/api/product/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (respone.data.success) {
        setCategories(respone.data.categories);
        setSuppliers(respone.data.suppliers);
        setProducts(respone.data.products);
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
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditProduct(null);
    setFormData({
      productName: "",
      productDescription: "",
      productPrice: "",
      productStock: "",
      category: "",
      supplier: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (editProduct) {
      try {
        const respone = await axios.put(
          `http://localhost:25569/api/product/${editProduct}`,
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
            productName: "",
            productDescription: "",
            productPrice: "",
            productStock: "",
            category: "",
            supplier: "",
          });
          setOpenModal(false);
          setEditProduct(null);
          fetchProducts();
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
          "http://localhost:25569/api/product/add",
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
            productName: "",
            productDescription: "",
            productPrice: "",
            productStock: "",
            category: "",
            supplier: "",
          });
          setOpenModal(false);
          fetchProducts();
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

  const handleEdit = (product) => {
    setOpenModal(true);
    setEditProduct(product._id);
    setFormData({
      productName: product.name,
      productDescription: product.description,
      productPrice: product.price,
      productStock: product.stock,
      category: product.category._id,
      supplier: product.supplier._id,
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      try {
        const response = await axios.delete(
          `http://localhost:25569/api/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert(response.data.message);
          fetchProducts();
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
      <h1 className="text-2xl font-bold">Products Management</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Product..."
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
          Add Product
        </button>
      </div>
      <div>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">S NO</th>
              <th className="border border-gray-300 p-2">Product Name</th>
              <th className="border border-gray-300 p-2">Category Name</th>
              <th className="border border-gray-300 p-2">Supplier Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Stock</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product._id || index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{product.name}</td>
                  <td className="border border-gray-300 p-2">
                    {product.category.categoryName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.supplier.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.price}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span className="rounded-full font-semibold">
                      {product.stock === 0 ? (
                        <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="bg-yellow-100 text-yellow-500 px-2 py-1 rounded-full">
                          {product.stock}
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-500 px-2 py-1 rounded-full">
                          {product.stock}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 flex gap-2 justify-center">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                      onClick={() => {
                        handleEdit(product);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                      onClick={() => {
                        handleDelete(product._id);
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
                  No Product found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openModal && (
        <div className=" fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-xl font-bold">Add Product</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              onClick={handleCloseModal}
            >
              X
            </button>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handelSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                className="border p-1 bg-white rounded px-4"
                name="productName"
                onChange={handleChange}
                value={formData.productName}
              />
              <input
                type="text"
                placeholder="Product Description"
                className="border p-1 bg-white rounded px-4"
                name="productDescription"
                onChange={handleChange}
                value={formData.productDescription}
              />
              <input
                type="number"
                placeholder="Product Price"
                className="border p-1 bg-white rounded px-4"
                name="productPrice"
                onChange={handleChange}
                value={formData.productPrice}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                className="border p-1 bg-white rounded px-4"
                name="productStock"
                min="0"
                onChange={handleChange}
                value={formData.productStock}
              />
              <div className="w-full border">
                <select
                  name="category"
                  className="w-full p-2"
                  onChange={handleChange}
                  value={formData.category}
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
                  name="supplier"
                  className="w-full p-2"
                  onChange={handleChange}
                  value={formData.supplier}
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
              {editProduct ? (
                <button className="w-full mt-2 bg-yellow-500 text-white rounded-md p-3 cursor-pointer hover:bg-amber-300">
                  Save Changes
                </button>
              ) : (
                <button className="w-full mt-2 bg-blue-500 text-white rounded-md p-3 cursor-pointer hover:bg-blue-300">
                  Add Product
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
