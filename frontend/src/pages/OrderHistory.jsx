
import { useState } from "react";
import {
  Search,
  Receipt,
  ShoppingBag,
  Eye,
  CalendarDays,
  CreditCard,
} from "lucide-react";

import "./OrderHistory.css";

function OrderHistory({ orders = [] }) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) =>
    String(order.number).toLowerCase().includes(search.toLowerCase())
  );

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <div className="history-page">
      <div className="history-heading">
        <div>
          <h2>Order History</h2>
          <p>View and manage all completed restaurant orders.</p>
        </div>

        <div className="history-heading-icon">
          <Receipt size={22} />
          Sales Records
        </div>
      </div>

      <div className="history-stats">
        <div className="history-stat-card">
          <span>Total Orders</span>
          <h3>{orders.length}</h3>
          <ShoppingBag size={25} />
        </div>

        <div className="history-stat-card">
          <span>Total Sales</span>
          <h3>Rs. {totalSales.toLocaleString()}</h3>
          <CreditCard size={25} />
        </div>

        <div className="history-stat-card">
          <span>Average Order</span>
          <h3>
            Rs.{" "}
            {orders.length
              ? Math.round(totalSales / orders.length).toLocaleString()
              : 0}
          </h3>
          <Receipt size={25} />
        </div>
      </div>

      <div className="history-content">
        <div className="history-toolbar">
          <div>
            <h3>All Orders</h3>
            <p>Complete sales transaction records</p>
          </div>

          <div className="history-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search order number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.number}>
                  <td>
                    <strong>#{order.number}</strong>
                  </td>

                  <td>{order.date}</td>

                  <td>{order.items?.length || 0} items</td>

                  <td>
                    <strong>
                      Rs. {Number(order.total).toLocaleString()}
                    </strong>
                  </td>

                  <td>Rs. {Number(order.paid).toLocaleString()}</td>

                  <td>
                    <span className="payment-badge">
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td>
                    <button
                      className="history-view-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="history-empty">
                    <ShoppingBag size={35} />
                    <strong>No orders found</strong>
                    <span>Completed orders will appear here.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="history-modal-overlay">
          <div className="history-modal">
            <button
              className="history-modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <div className="history-modal-title">
              <Receipt size={25} />
              <h2>Order Details</h2>
            </div>

            <p>Order #{selectedOrder.number}</p>
            <p>
              <CalendarDays size={15} /> {selectedOrder.date}
            </p>

            <div className="history-detail-items">
              {selectedOrder.items.map((item, index) => (
                <div key={`${item.id}-${index}`}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>
                    Rs.{" "}
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            <div className="history-detail-total">
              <span>Total</span>
              <strong>
                Rs. {Number(selectedOrder.total).toLocaleString()}
              </strong>
            </div>

            <div className="history-detail-row">
              <span>Paid Amount</span>
              <strong>
                Rs. {Number(selectedOrder.paid).toLocaleString()}
              </strong>
            </div>

            <div className="history-detail-row">
              <span>Change</span>
              <strong>
                Rs. {Number(selectedOrder.balance).toLocaleString()}
              </strong>
            </div>

            <div className="history-detail-row">
              <span>Payment Method</span>
              <strong>{selectedOrder.paymentMethod}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
