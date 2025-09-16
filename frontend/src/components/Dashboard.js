import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_SALES = "https://backend-t6dk.onrender.com/api/sales";

const Dashboard = ({ products, customers }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [loadingSales, setLoadingSales] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(API_SALES);
        if (res.ok) {
          const salesData = await res.json();
          const total = salesData.reduce((sum, sale) => sum + (sale.amount || 0), 0);
          setTotalSales(total);
        }
      } catch (err) {
        console.error("Error loading sales:", err);
      } finally {
        setLoadingSales(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div>
      <style>{`
        .dashboard-container {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        .summary-cards {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .card {
          flex: 1;
          min-width: 200px;
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .card-heading {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .card-count {
          font-size: 2rem;
          font-weight: bold;
          color: #2563eb;
        }
        .tables-section {
          display: grid;
          gap: 2rem;
        }
        .table-container {
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          overflow-x: auto; /* Enable horizontal scroll on small screens */
        }
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .styled-table {
          width: 100%;
          min-width: 600px; /* Ensure table is wide enough for all columns */
          border-collapse: collapse;
        }
        .styled-table th,
        .styled-table td {
          padding: 0.75rem 1rem; /* Increased padding for readability */
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          white-space: nowrap; /* Prevent text wrapping */
          overflow: hidden; /* Handle overflow */
          text-overflow: ellipsis; /* Add ellipsis for truncated text */
        }
        .styled-table th {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }
        .styled-table tr:hover td {
          background: #f9fafb;
        }
        .no-data {
          text-align: center;
          padding: 1rem;
          color: #6b7280;
          font-style: italic;
        }
        .nav-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 6px;
          text-decoration: none;
          color: #fff;
          transition: background 0.2s;
        }
        .btn-blue {
          background: #2563eb;
        }
        .btn-blue:hover {
          background: #1e40af;
        }
        .btn-green {
          background: #16a34a;
        }
        .btn-green:hover {
          background: #15803d;
        }
      `}</style>

      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard</h2>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <h3 className="card-heading">Products</h3>
            <p className="card-count">{products.length}</p>
          </div>
          <div className="card">
            <h3 className="card-heading">Customers</h3>
            <p className="card-count">{customers.length}</p>
          </div>
          <div className="card">
            <h3 className="card-heading">Total Sales</h3>
            <p className="card-count">
              {loadingSales ? "Loading..." : `M${totalSales.toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Tables Section */}
        <div className="tables-section">
          {/* Products Table */}
          <div className="table-container">
            <h4 className="section-title">Products</h4>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Stock Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td title={p.description}>{p.description}</td> {/* Tooltip for full text */}
                      <td>{p.category}</td>
                      <td>M{p.price}</td>
                      <td style={{ color: p.quantity < 5 ? 'red' : 'green' }}>
                        {p.quantity}
                      </td>
                      <td style={{ color: p.quantity < 5 ? 'red' : 'green' }}>
                        {p.quantity < 5 ? "Low Stock" : "In Stock"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No products available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Customers Table */}
          <div className="table-container">
            <h4 className="section-title">Customers</h4>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.slice(0, 5).map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td title={c.email}>{c.email}</td> {/* Tooltip for full text */}
                      <td>{c.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">No customers yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <Link to="/product-management" className="btn btn-blue">
            Manage Products
          </Link>
          <Link to="/customers" className="btn btn-green">
            Manage Customers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
