import React, { useState, useEffect } from "react";

const API_PRODUCTS = "https://backend-t6dk.onrender.com/api/products";
const API_CUSTOMERS = "https://backend-t6dk.onrender.com/api/customers";
const API_SALES = "https://backend-t6dk.onrender.com/api/sales";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [saleQty, setSaleQty] = useState(1);
  const [saleSuccess, setSaleSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Load products, customers, and sales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, custRes, salesRes] = await Promise.all([
          fetch(API_PRODUCTS),
          fetch(API_CUSTOMERS),
          fetch(API_SALES),
        ]);
        const [prodData, custData, salesData] = await Promise.all([
          prodRes.json(),
          custRes.json(),
          salesRes.json(),
        ]);
        setProducts(prodData);
        setCustomers(custData);
        setSalesHistory(salesData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSell = async () => {
    if (!selectedProductId || !selectedCustomerId || saleQty < 1) {
      alert("Please select a product, customer, and enter a valid quantity");
      return;
    }

    const product = products.find((p) => p._id === selectedProductId);
    const customer = customers.find((c) => c._id === selectedCustomerId);

    if (!product || !customer) return;
    if (product.quantity < saleQty) {
      alert("Not enough stock");
      return;
    }

    const saleData = {
      productId: product._id,
      customerId: customer._id,
      quantity: saleQty,
    };

    try {
      const res = await fetch(API_SALES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
      if (!res.ok) throw new Error("Failed to save sale");
      const savedSale = await res.json();

      setProducts((prev) =>
        prev.map((p) =>
          p._id === savedSale.productId
            ? { ...p, quantity: p.quantity - saleQty }
            : p
        )
      );

      setSalesHistory((prev) => [savedSale, ...prev]);
      setSaleSuccess(`Sold ${saleQty} ${product.name} to ${customer.name}`);

      setSelectedProductId("");
      setSelectedCustomerId("");
      setSaleQty(1);
    } catch (err) {
      console.error(err);
      alert("Error saving sale. Check backend.");
    }
  };

  if (loading) return <p>Loading data…</p>;

  const totalSalesAmount = salesHistory.reduce(
    (sum, sale) => sum + (sale.amount || 0),
    0
  );

  return (
    <div>
      {/* Internal CSS */}
      <style>{`
        .container {
          padding: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        .title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .success {
          background: #d1fae5;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 6px;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        .select, .input {
          width: 100%;
          border: 1px solid #ccc;
          padding: 0.5rem;
          border-radius: 6px;
        }
        .button {
          background: #22c55e;
          color: #fff;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        .button:hover {
          background: #16a34a;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 6px;
          background: #f9fafb;
          margin-bottom: 2rem;
        }
        .subtitle {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ccc;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 0.5rem;
          text-align: left;
        }
        th {
          background: #f3f4f6;
        }
        .total-row {
          font-weight: 600;
          background: #f9fafb;
        }
        .text-right {
          text-align: right;
        }
      `}</style>

      <div className="container">
        <h2 className="title">Sales</h2>

        {saleSuccess && <div className="success">{saleSuccess}</div>}

        {/* Product selection */}
        <div className="form-group">
          <label className="label">Select Product</label>
          <select
            className="select"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (In stock: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Customer selection */}
        <div className="form-group">
          <label className="label">Select Customer</label>
          <select
            className="select"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label className="label">Quantity</label>
          <input
            type="number"
            min={1}
            className="input"
            value={saleQty}
            onChange={(e) => setSaleQty(parseInt(e.target.value))}
          />
        </div>

        {/* Sell button */}
        <button className="button" onClick={handleSell}>
          Sell Product
        </button>

        {/* Receipt for last sale */}
        {saleSuccess && salesHistory[0] && (
          <div className="receipt">
            <h3 className="subtitle">Receipt</h3>
            <p>
              <strong>Date:</strong> {salesHistory[0].date}
            </p>
            <p>
              <strong>Customer:</strong> {salesHistory[0].customerName}
            </p>
            <p>
              <strong>Product:</strong> {salesHistory[0].productName}
            </p>
            <p>
              <strong>Quantity:</strong> {salesHistory[0].quantity}
            </p>
            <p>
              <strong>Total Amount:</strong> M{salesHistory[0].amount}
            </p>
          </div>
        )}

        {/* Sales History Table */}
        <h3 className="subtitle">Sales History</h3>
        {salesHistory.length === 0 ? (
          <p>No sales yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.date}</td>
                  <td>{sale.customerName}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>M{sale.amount}</td>
                </tr>
              ))}
              {/* Total sales sum row */}
              <tr className="total-row">
                <td colSpan={4} className="text-right">
                  Total Sales:
                </td>
                <td>M{totalSalesAmount}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Sales;
