import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link
          to="/dashboard/admin/categories/add"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{cat.name}</td>
                <td className="p-3 capitalize">{cat.type}</td>
                <td className="p-3 flex gap-3">
                  <Link
                    to={`/dashboard/admin/categories/edit/${cat._id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
