
import React from "react";
import { Printer, X } from "lucide-react";

import "./Invoice.css";
import defaultLogo from "../assets/Logo.jpeg";

function Invoice({ order, onClose, settings = {} }) {
  if (!order) return null;

  const restaurantName =
    settings.name || "Royal Refreshment Center";

  const restaurantLogo =
    settings.logo || defaultLogo;

  const footerMessage =
    settings.footer || "Thank you for visiting us!";

  const formatRs = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice-overlay">
      <div className="invoice-modal">
        <div className="invoice-actions">
          <button
            onClick={printInvoice}
            className="invoice-print-btn"
          >
            <Printer size={17} />
            Print Invoice
          </button>

          <button
            onClick={onClose}
            className="invoice-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <div className="invoice-print-area">
          <div className="invoice-header">
            <img
              src={restaurantLogo}
              alt="Restaurant Logo"
              className="invoice-logo"
            />

            <h1>{restaurantName.toUpperCase()}</h1>

            <p>Restaurant Invoice & Receipt</p>

            {settings.phone && (
              <p>Phone: {settings.phone}</p>
            )}

            {settings.email && (
              <p>Email: {settings.email}</p>
            )}

            {settings.address && (
              <p>{settings.address}</p>
            )}

            <div className="invoice-line" />
          </div>

          <div className="invoice-details">
            <div>
              <strong>Invoice No:</strong> #{order.number}
            </div>

            <div>
              <strong>Date:</strong> {order.date}
            </div>

            <div>
              <strong>Payment:</strong> {order.paymentMethod}
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>

                  <td>{formatRs(item.price)}</td>

                  <td>{item.quantity}</td>

                  <td>
                    {formatRs(
                      Number(item.price) * item.quantity
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-summary">
            <div>
              <span>Total Amount</span>
              <strong>{formatRs(order.total)}</strong>
            </div>

            <div>
              <span>Paid Amount</span>
              <strong>{formatRs(order.paid)}</strong>
            </div>

            {Number(order.balance) > 0 && (
              <div>
                <span>Return / Change</span>
                <strong>{formatRs(order.balance)}</strong>
              </div>
            )}

            {Number(order.paid) < Number(order.total) && (
              <div>
                <span>Remaining Amount</span>
                <strong>
                  {formatRs(order.total - order.paid)}
                </strong>
              </div>
            )}
          </div>

          <div className="invoice-footer">
            <h3>Thank You!</h3>
            <p>{footerMessage}</p>
            <p>We hope to serve you again.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
