import { useEffect, useState } from "react";

const Products = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Products Management</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Supplier..."
          value={""}
          className="border p-1 bg-white rounded px-4"
          name="searchTerm"
          onChange={() => {}}
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
      {openModal && (
        <div className=" fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-xl font-bold">Add Product</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              X
            </button>
            <form className="flex flex-col gap-4 mt-4" onSubmit={() => {}}>
              <input
                type="text"
                placeholder="Product Name"
                className="border p-1 bg-white rounded px-4"
                name="productName"
                onChange={() => {}}
                value={""}
              />
              <input
                type="text"
                placeholder="Product Description"
                className="border p-1 bg-white rounded px-4"
                name="productDescription"
                onChange={() => {}}
                value={""}
              />
              <input
                type="number"
                placeholder="Product Price"
                className="border p-1 bg-white rounded px-4"
                name="productPrice"
                onChange={() => {}}
                value={""}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                className="border p-1 bg-white rounded px-4"
                name="productStock"
                onChange={() => {}}
                value={""}
              />
              <div>
                <select name="category">
                  <option value="">Select Category</option>
                </select>
              </div>
              <div>
                <select name="supplier">
                  <option value="">Select Supplier</option>
                </select>
              </div>
              <button className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer">
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
