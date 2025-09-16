import React, { useState, useEffect } from "react";

const API_URL = "https://backend-t6dk.onrender.com/api/customers";

const Customers = ({ customers, setCustomers }) => {
  const [localCustomers, setLocalCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const displayedCustomers = Array.isArray(customers) ? customers : localCustomers;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (setCustomers) {
          setCustomers(data);
        } else {
          setLocalCustomers(data);
        }
      } catch (err) {
        console.error("Error loading customers:", err);
        setMessage("Could not load customers (start backend?)");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setCustomers]);

  const handleAddCustomer = async () => {
    setMessage("");
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMessage("Please fill all fields.");
      return;
    }

    setSaving(true);
    const newCustomer = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const saved = await res.json();

      if (setCustomers) {
        setCustomers((prev) => (Array.isArray(prev) ? [...prev, saved] : [saved]));
      } else {
        setLocalCustomers((prev) => [...prev, saved]);
      }

      setName("");
      setEmail("");
      setPhone("");
      setMessage("Customer added successfully.");
    } catch (err) {
      console.error("Error saving customer:", err);
      setMessage("Failed to save customer. Check backend.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div>
      <style>{`
        .customers-container {
          padding: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .customers-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .customers-title {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .customers-button {
          background: #22c55e;
          color: #fff;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .customers-button:hover {
          background: #16a34a;
        }
        .customers-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .customers-message {
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 6px;
        }
        .customers-message.success {
          background: #d1fae5;
        }
        .customers-message.error {
          background: #fee2e2;
        }
        .customers-inputs {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 768px) {
          .customers-inputs {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .customers-input {
          border: 1px solid #ccc;
          padding: 0.75rem;
          border-radius: 6px;
        }
        .customers-input:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 2px #bbf7d0;
        }
        .customers-list {
          margin-top: 2rem;
        }
        .customers-subtitle {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .customers-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .customers-table th,
        .customers-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }
        .customers-table th {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }
        .customers-table tr:hover td {
          background: #f9fafb;
        }
        .customers-empty {
          color: #6b7280;
          font-style: italic;
        }
      `}</style>

      <div className="customers-container">
        <div className="customers-header">
          <h2 className="customers-title">Add Customer</h2>
          <button
            type="button"
            onClick={handleAddCustomer}
            disabled={saving}
            className={`customers-button ${saving ? "disabled" : ""}`}
          >
            {saving ? "Saving..." : "Add Customer"}
          </button>
        </div>

        {/* feedback */}
        {message && (
          <div
            className={`customers-message ${
              message.includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        {/* Input Fields */}
        <div className="customers-inputs">
          <input
            className="customers-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="customers-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="customers-input"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Customer List */}
        <div className="customers-list">
          <h3 className="customers-subtitle">Customer List</h3>

          {loading ? (
            <p>Loading customers…</p>
          ) : displayedCustomers.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCustomers.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="customers-empty">No customers added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
