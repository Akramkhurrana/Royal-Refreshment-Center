
import { useMemo, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Wallet,
  BadgeDollarSign,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Download,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./SalesReports.css";

function SalesReports({ orders = [], expenses = [] }) {
  const [period, setPeriod] = useState("All");

  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      if (period === "All") return true;

      const orderDate = new Date(order.date);
      if (Number.isNaN(orderDate.getTime())) return false;

      if (period === "Today") {
        return orderDate.toDateString() === now.toDateString();
      }

      if (period === "This Month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "This Year") {
        return orderDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [orders, period]);

  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return expenses.filter((expense) => {
      if (period === "All") return true;

      const expenseDate = new Date(expense.date + "T00:00:00");

      if (period === "Today") {
        return expenseDate.toDateString() === now.toDateString();
      }

      if (period === "This Month") {
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "This Year") {
        return expenseDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [expenses, period]);

  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const netProfit = totalSales - totalExpenses;

  const averageOrder =
    filteredOrders.length > 0
      ? totalSales / filteredOrders.length
      : 0;

  const paymentTotals = filteredOrders.reduce((result, order) => {
    const method = order.paymentMethod || "Other";
    result[method] = (result[method] || 0) + Number(order.total || 0);
    return result;
  }, {});

  const maxPayment = Math.max(...Object.values(paymentTotals), 1);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Royal Refreshment Center", 14, 20);

    doc.setFontSize(15);
    doc.text("Sales Report", 14, 30);

    doc.setFontSize(10);
    doc.text(`Report Period: ${period}`, 14, 38);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 44);

    autoTable(doc, {
      startY: 52,
      head: [["Business Summary", "Amount"]],
      body: [
        ["Total Sales", `Rs. ${totalSales.toLocaleString()}`],
        ["Total Orders", String(filteredOrders.length)],
        ["Total Expenses", `Rs. ${totalExpenses.toLocaleString()}`],
        ["Average Order", `Rs. ${averageOrder.toLocaleString()}`],
        ["Net Profit", `Rs. ${netProfit.toLocaleString()}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [15, 118, 110] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Order ID", "Date", "Payment", "Amount"]],
      body: filteredOrders.map((order, index) => [
        order.orderNumber || `Order ${index + 1}`,
        order.date
          ? new Date(order.date).toLocaleDateString()
          : "-",
        order.paymentMethod || "Other",
        `Rs. ${Number(order.total || 0).toLocaleString()}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Expense", "Category", "Date", "Amount"]],
      body: filteredExpenses.map((expense) => [
        expense.title,
        expense.category,
        expense.date,
        `Rs. ${Number(expense.amount || 0).toLocaleString()}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
    });

    doc.save(`Royal-Refreshment-${period}-Report.pdf`);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="sales-reports-page">
      <div className="sales-reports-heading">
        <div>
          <h2>Sales Reports</h2>
          <p>Monitor restaurant sales, expenses and profit.</p>
        </div>

        <div className="report-actions">
          <button className="report-print-btn" onClick={printReport}>
            <Printer size={17} />
            Print
          </button>

          <button className="report-download-btn" onClick={downloadPDF}>
            <Download size={17} />
            Download PDF
          </button>

          <div className="report-filter">
            <CalendarDays size={18} />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>All</option>
              <option>Today</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="report-stats">
        <div className="report-card">
          <div className="report-card-top">
            <div className="report-icon sales-icon"><TrendingUp /></div>
            <span className="report-label">Total Sales</span>
          </div>
          <h3>Rs. {totalSales.toLocaleString()}</h3>
          <p>Revenue from completed orders</p>
        </div>

        <div className="report-card">
          <div className="report-card-top">
            <div className="report-icon orders-icon"><ShoppingBag /></div>
            <span className="report-label">Total Orders</span>
          </div>
          <h3>{filteredOrders.length}</h3>
          <p>Orders in selected period</p>
        </div>

        <div className="report-card">
          <div className="report-card-top">
            <div className="report-icon expenses-icon"><Wallet /></div>
            <span className="report-label">Total Expenses</span>
          </div>
          <h3>Rs. {totalExpenses.toLocaleString()}</h3>
          <p>Recorded restaurant expenses</p>
        </div>

        <div className="report-card">
          <div className="report-card-top">
            <div className="report-icon profit-icon"><BadgeDollarSign /></div>
            <span className="report-label">Net Profit</span>
          </div>
          <h3 className={netProfit < 0 ? "negative-profit" : ""}>
            Rs. {netProfit.toLocaleString()}
          </h3>
          <p>Sales minus recorded expenses</p>
        </div>
      </div>

      <div className="report-bottom-grid">
        <div className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h3>Business Summary</h3>
              <p>Financial overview for selected period</p>
            </div>
          </div>

          <div className="summary-row">
            <span>Total Revenue</span>
            <strong>Rs. {totalSales.toLocaleString()}</strong>
          </div>

          <div className="summary-row">
            <span>Total Expenses</span>
            <strong className="summary-expense">
              Rs. {totalExpenses.toLocaleString()}
            </strong>
          </div>

          <div className="summary-row">
            <span>Average Order Value</span>
            <strong>
              Rs. {averageOrder.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="summary-total">
            <span>Net Profit</span>
            <strong>Rs. {netProfit.toLocaleString()}</strong>
            {netProfit >= 0 ? (
              <ArrowUpRight size={19} />
            ) : (
              <ArrowDownRight size={19} />
            )}
          </div>
        </div>

        <div className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h3>Payment Methods</h3>
              <p>Sales by payment type</p>
            </div>
          </div>

          {Object.keys(paymentTotals).length === 0 ? (
            <div className="report-empty">No payment records available.</div>
          ) : (
            <div className="payment-method-list">
              {Object.entries(paymentTotals).map(([method, amount]) => (
                <div className="payment-method-item" key={method}>
                  <div className="payment-method-info">
                    <strong>{method}</strong>
                    <span>Rs. {amount.toLocaleString()}</span>
                  </div>
                  <div className="payment-progress">
                    <div style={{ width: `${(amount / maxPayment) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="report-table-panel">
        <div className="report-panel-heading">
          <div>
            <h3>Recent Sales</h3>
            <p>Orders included in this report</p>
          </div>
        </div>

        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order.id || order.orderNumber || index}>
                    <td>{order.orderNumber || `Order ${index + 1}`}</td>
                    <td>
                      {order.date
                        ? new Date(order.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{order.paymentMethod || "Other"}</td>
                    <td className="report-sale-amount">
                      Rs. {Number(order.total || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="report-empty">
                    No sales records available for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesReports;
