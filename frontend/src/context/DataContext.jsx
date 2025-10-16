import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
    validateStatus: (s) => s >= 200 && s < 500,
  });

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get(
        "http://localhost:25569/api/category/",
        getAuthHeaders()
      );
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const res = await axios.get(
        "http://localhost:25569/api/supplier/",
        getAuthHeaders()
      );
      setSuppliers(res.data.suppliers || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // When admin logs in, load both lists
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchCategories();
      fetchSuppliers();
    } else {
      // clear when user logs out or not admin
      setCategories([]);
      setSuppliers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        categories,
        suppliers,
        fetchCategories,
        fetchSuppliers,
        loadingCategories,
        loadingSuppliers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

export default DataProvider;
