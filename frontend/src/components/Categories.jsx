import axios from "axios";
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext.jsx";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const { categories, fetchCategories, loadingCategories } = useData();
  const [loading, setLoading] = useState(loadingCategories);
  const [edittedCategory, setEdittedCategory] = useState(null);

  // use categories and fetchCategories from context
  useEffect(() => {
    setLoading(loadingCategories);
  }, [loadingCategories]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (edittedCategory) {
      try {
        const reponse = await axios.put(
          `http://localhost:25569/api/category/${edittedCategory}`,
          {
            categoryName,
            categoryDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
            validateStatus: (status) => status >= 200 && status < 500,
          }
        );
        if (reponse.data.success) {
          alert("Category Updated successfully");
          fetchCategories();
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
        setEdittedCategory(null);
        setCategoryName("");
        setCategoryDescription("");
      }
    } else {
      try {
        const reponse = await axios.post(
          "http://localhost:25569/api/category/add",
          {
            categoryName,
            categoryDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
            validateStatus: (status) => status >= 200 && status < 500,
          }
        );
        if (reponse.data.success) {
          alert("Category added successfully");
          fetchCategories();
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
        setCategoryName("");
        setCategoryDescription("");
      }
    }
  };

  const hanleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(
          `http://localhost:25569/api/category/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Category deleted successfully");
          fetchCategories();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert(error.response?.data?.message || "Internal server error");
      }
    }
  };

  const handleEdit = async (category) => {
    setEdittedCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handelCancleEdit = () => {
    setEdittedCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  if (loading) return <div> Loadding ... </div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Category Managment</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-bold mb-4">
              {edittedCategory ? "Edit Category" : "Add Category"}
            </h2>
            <form className="space-y-4" onSubmit={handelSubmit}>
              <div>
                <input
                  type="text"
                  value={categoryName}
                  className="border w-full p-2 rounded-md"
                  placeholder="Category Name"
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={categoryDescription}
                  className="border w-full p-2 rounded-md"
                  placeholder="Category Description"
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-300"
                  type="submit"
                >
                  {edittedCategory ? "Save Changes" : "Add Category"}
                </button>
                {edittedCategory && (
                  <button
                    type="button"
                    className="w-full rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-300"
                    onClick={handelCancleEdit}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">No.</th>
                  <th className="border border-gray-200 p-2">Category Name</th>
                  <th className="border border-gray-200 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id || index}>
                    <td className="border border-gray-200 p-2">{index + 1}</td>
                    <td className="border border-gray-200 p-2">
                      {category.categoryName}
                    </td>
                    <td className="border border-gray-200 p-2 flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-300"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-300"
                        onClick={() => hanleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
