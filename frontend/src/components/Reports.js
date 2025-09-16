import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js modules
ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://backend-t6dk.onrender.com/api/products");
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const products = await res.json();

        // Prepare data for Pie chart
        const labels = products.map((p) => p.name);
        const dataPoints = products.map((p) => p.quantity);
        const backgroundColors = products.map((p) =>
          p.quantity < 5 ? "red" : "green"
        );

        setInventoryData({
          labels,
          datasets: [
            {
              label: "Inventory Quantity",
              data: dataPoints,
              backgroundColor: backgroundColors,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div>
        <style>{`
          .page-container {
            padding: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .title {
            font-size: 1.75rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
        `}</style>
        <div className="page-container">
          <h2 className="title">Inventory Distribution</h2>
          <p>Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .page-container {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .title {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .card {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="page-container">
        <h2 className="title">Inventory Distribution</h2>
        {inventoryData ? (
          <div className="card">
            <Pie data={inventoryData} />
          </div>
        ) : (
          <p>Failed to load inventory data.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryReport;
