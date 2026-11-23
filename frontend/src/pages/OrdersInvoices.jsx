
import { useState } from "react";
import {
  Search,
  Receipt,
  Eye,
  Printer,
  FileText,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import "./OrdersInvoices.css";

function OrdersInvoices({ orders = [] }) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) =>
    String(order.number).toLowerCase().includes(search.toLowerCase())
  );

  const formatRs = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const getRemaining = (order) =>
    Math.max(
      0,
      Number(order.total || 0) - Number(order.paid || 0)
    );

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalReceived = orders.reduce(
    (sum, order) => sum + Number(order.paid || 0),
    0
  );

  const totalRemaining = orders.reduce(
    (sum, order) => sum + getRemaining(order),
    0
  );

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="invoices-page">
      <div className="invoices-heading">
        <div>
          <h2>Orders & Invoices</h2>
          <p>Manage completed orders and customer invoices.</p>
        </div>

        <div className="invoices-icon">
          <Receipt size={22} />
          Invoice Management
        </div>
      </div>

      <div className="invoices-stats">
        <div className="invoice-stat">
          <ShoppingBag size={24} />
          <div>
            <span>Total Invoices</span>
            <h3>{orders.length}</h3>
          </div>
        </div>

        <div className="invoice-stat">
          <FileText size={24} />
          <div>
            <span>Total Sales</span>
            <h3>{formatRs(totalSales)}</h3>
          </div>
        </div>

        <div className="invoice-stat">
          <Wallet size={24} />
          <div>
            <span>Total Received</span>
            <h3>{formatRs(totalReceived)}</h3>
          </div>
        </div>

        <div className="invoice-stat">
          <Receipt size={24} />
          <div>
            <span>Remaining Payments</span>
            <h3>{formatRs(totalRemaining)}</h3>
          </div>
        </div>
      </div>

      <div className="invoices-card">
        <div className="invoices-toolbar">
          <div>
            <h3>Invoice Records</h3>
            <p>All completed customer transactions</p>
          </div>

          <div className="invoices-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search invoice number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="invoices-table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const remaining = getRemaining(order);

                return (
                  <tr key={order.number}>
                    <td>
                      <strong>INV-{order.number}</strong>
                    </td>

                    <td>{order.date}</td>

                    <td>{order.items?.length || 0} items</td>

                    <td>
                      <strong>{formatRs(order.total)}</strong>
                    </td>

                    <td>{formatRs(order.paid)}</td>

                    <td>
                      <strong
                        style={{
                          color: remaining > 0 ? "#dc5656" : "#15945b",
                        }}
                      >
                        {formatRs(remaining)}
                      </strong>
                    </td>

                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            remaining > 0 ? "#fff0e6" : "#e8f8ef",
                          color:
                            remaining > 0 ? "#c56a20" : "#15945b",
                        }}
                      >
                        {remaining > 0 ? "Partial" : "Paid"}
                      </span>
                    </td>

                    <td>{order.paymentMethod}</td>

                    <td>
                      <button
                        className="invoice-action-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} />
                        View Invoice
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="invoices-empty">
                    <Receipt size={35} />
                    <strong>No invoices found</strong>
                    <span>Completed invoices will appear here.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="invoice-modal-overlay">
          <div className="invoice-modal">
            <div className="invoice-modal-header">
              <div>
                <h2>Royal Refreshment Center</h2>
                <p>Customer Invoice</p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="invoice-close-btn"
              >
                ×
              </button>
            </div>

            <div className="invoice-meta">
              <div>
                <span>Invoice Number</span>
                <strong>INV-{selectedOrder.number}</strong>
              </div>

              <div>
                <span>Date & Time</span>
                <strong>{selectedOrder.date}</strong>
              </div>
            </div>

            <div className="invoice-items">
              <div className="invoice-item invoice-item-heading">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
              </div>

              {selectedOrder.items.map((item, index) => (
                <div
                  className="invoice-item"
                  key={`${item.id}-${index}`}
                >
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <span>{formatRs(item.price)}</span>
                  <span>
                    {formatRs(
                      Number(item.price) * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="invoice-total">
              <span>Grand Total</span>
              <strong>{formatRs(selectedOrder.total)}</strong>
            </div>

            <div className="invoice-payment-info">
              <p>
                Payment Method:{" "}
                <strong>{selectedOrder.paymentMethod}</strong>
              </p>

              <p>
                Paid Amount:{" "}
                <strong>{formatRs(selectedOrder.paid)}</strong>
              </p>

              <p>
                Remaining Amount:{" "}
                <strong style={{ color: "#dc5656" }}>
                  {formatRs(getRemaining(selectedOrder))}
                </strong>
              </p>

              <p>
                Change / Return:{" "}
                <strong>{formatRs(selectedOrder.balance)}</strong>
              </p>

              <p>
                Payment Status:{" "}
                <strong
                  style={{
                    color:
                      getRemaining(selectedOrder) > 0
                        ? "#c56a20"
                        : "#15945b",
                  }}
                >
                  {getRemaining(selectedOrder) > 0
                    ? "Partial Payment"
                    : "Paid"}
                </strong>
              </p>
            </div>

            <div className="invoice-footer">
              <p>Thank you for visiting!</p>
              <span>Royal Refreshment Center</span>
            </div>

            <button
              className="invoice-print-btn"
              onClick={printInvoice}
            >
              <Printer size={18} />
              Print Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersInvoices;
