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

        // Use multiple colors for better distinction
        const palette = [
          "#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336",
          "#00bcd4", "#8bc34a", "#ffc107", "#795548", "#3f51b5"
        ];
        const backgroundColors = products.map(
          (_, i) => palette[i % palette.length]
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
          .inventory-container {
            padding: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .inventory-title {
            font-size: 1.75rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
        `}</style>
        <div className="inventory-container">
          <h2 className="inventory-title">Inventory Distribution</h2>
          <p>Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .inventory-container {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .inventory-title {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .inventory-card {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          display: flex;
          justify-content: center;
        }
        .inventory-chart {
          max-width: 400px;
          max-height: 400px;
        }
      `}</style>

      <div className="inventory-container">
        <h2 className="inventory-title">Inventory Distribution</h2>
        {inventoryData ? (
          <div className="inventory-card">
            <div className="inventory-chart">
              <Pie
                data={inventoryData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
                height={300}
                width={300}
              />
            </div>
          </div>
        ) : (
          <p>Failed to load inventory data.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryReport;
