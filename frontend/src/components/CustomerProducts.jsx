import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });

  const filteredProducts = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();

    if (!term && !selectedFilterCategory) return products;

    return products.filter((p) => {
      const matchesTerm = !term || (p.name || "").toLowerCase().includes(term);
      if (!selectedFilterCategory) {
        return matchesTerm;
      }

      const productCatId = p.category?._id;
      const matchesCategory =
        String(productCatId) === String(selectedFilterCategory);

      return matchesTerm && matchesCategory;
    });
  }, [products, searchTerm, selectedFilterCategory]);

  const fetchProducts = async () => {
    try {
      const respone = await axios.get("http://localhost:25569/api/product/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (respone.data.success) {
        setCategories(respone.data.categories);
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleChangeCategory = (value) => {
    setSelectedFilterCategory(value);
  };

  const handleProductOrder = (product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      stock: product.stock,
      price: product.price,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOrderData({
      productId: "",
      quantity: 1,
      total: 0,
      stock: 0,
      price: 0,
    });
    setOpenModal(false);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:25569/api/order/add",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setOpenModal(false);
        setOrderData({
          productId: "",
          quantity: 1,
          total: 0,
          stock: 0,
          price: 0,
        });
        alert(response.data.message);
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

  const increaseQuantity = (e) => {
    if (e.target.value > orderData.stock) {
      alert("not enought stock");
    } else {
      setOrderData({
        ...orderData,
        quantity: parseInt(e.target.value),
        total: parseInt(e.target.value) * parseInt(orderData.price),
      });
    }
  };

  return (
    <div>
      <div className="py-4 px-6">
        <h2 className=" font-bold text-xl">Products</h2>
      </div>
      <div className="py-4 px-6 flex justify-between items-center">
        <div>
          <select
            name="category"
            className="bg-white border p-2 rounded"
            onChange={(e) => {
              handleChangeCategory(e.target.value);
            }}
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option value={category._id}>{category.categoryName}</option>
            ))}
          </select>
        </div>
        <div>
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
        </div>
      </div>
      <div>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">S NO</th>
              <th className="border border-gray-300 p-2">Product Name</th>
              <th className="border border-gray-300 p-2">Category Name</th>
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
                      className="px-2 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-300"
                      onClick={() => handleProductOrder(product)}
                    >
                      Order
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
            <h1 className="text-xl font-bold">Place Order</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              onClick={handleCloseModal}
            >
              X
            </button>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handelSubmit}>
              <input
                type="number"
                placeholder="Increase Order Quantity"
                className="border p-1 bg-white rounded px-4"
                name="quantity"
                onChange={(e) => {
                  increaseQuantity(e);
                }}
                min="1"
                value={orderData.quantity}
              />

              <p>{orderData.quantity * orderData.price}</p>

              <button
                className="w-full mt-2 bg-blue-500 text-white rounded-md p-3 cursor-pointer hover:bg-blue-300"
                type="submit"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;
