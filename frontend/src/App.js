import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components//Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import Sales from "./components/Sales";
import Inventory from "./components/Inventory";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import "./App.css";

const API_BASE = "https://backend-t6dk.onrender.com";

const App = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Load data from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${API_BASE}/customers`);
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchProducts();
    fetchCustomers();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard products={products} customers={customers} />
              }
            />
            <Route
              path="/product-management"
              element={
                <ProductManagement
                  products={products}
                  setProducts={setProducts}
                />
              }
            />
            <Route
              path="/sales"
              element={
                <Sales
                  products={products}
                  setProducts={setProducts}
                  customers={customers}
                  setCustomers={setCustomers}
                />
              }
            />
            <Route
              path="/inventory"
              element={
                <Inventory products={products} setProducts={setProducts} />
              }
            />
            <Route
              path="/customers"
              element={
                <Customers
                  customers={customers}
                  setCustomers={setCustomers}
                />
              }
            />
            <Route
              path="/reports"
              element={<Reports products={products} />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
