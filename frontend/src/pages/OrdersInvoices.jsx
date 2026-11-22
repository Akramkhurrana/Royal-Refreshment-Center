
import { useState } from "react";
import {
  Search,
  Receipt,
  Eye,
  Printer,
  FileText,
  ShoppingBag,
} from "lucide-react";

import "./OrdersInvoices.css";

function OrdersInvoices({ orders = [] }) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) =>
    String(order.number).toLowerCase().includes(search.toLowerCase())
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
            <h3>
              Rs.{" "}
              {orders
                .reduce((sum, order) => sum + Number(order.total || 0), 0)
                .toLocaleString()}
            </h3>
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
                <th>Payment Method</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.number}>
                  <td>
                    <strong>INV-{order.number}</strong>
                  </td>

                  <td>{order.date}</td>

                  <td>{order.items?.length || 0} items</td>

                  <td>
                    <strong>
                      Rs. {Number(order.total).toLocaleString()}
                    </strong>
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
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="invoices-empty">
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
                <div className="invoice-item" key={`${item.id}-${index}`}>
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <span>Rs. {Number(item.price).toLocaleString()}</span>
                  <span>
                    Rs.{" "}
                    {(Number(item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="invoice-total">
              <span>Grand Total</span>
              <strong>
                Rs. {Number(selectedOrder.total).toLocaleString()}
              </strong>
            </div>

            <div className="invoice-payment-info">
              <p>
                Payment Method: <strong>{selectedOrder.paymentMethod}</strong>
              </p>
              <p>
                Paid Amount:{" "}
                <strong>Rs. {Number(selectedOrder.paid).toLocaleString()}</strong>
              </p>
                <p>
                Change:{" "}
                <strong>Rs. {Number(selectedOrder.balance).toLocaleString()}</strong>
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
