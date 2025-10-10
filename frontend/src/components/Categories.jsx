import axios from "axios";
import React from "react";

const Categories = () => {
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Category Managment</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-bold mb-4">Add Category</h2>
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
              <button
                className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-300"
                type="submit"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
