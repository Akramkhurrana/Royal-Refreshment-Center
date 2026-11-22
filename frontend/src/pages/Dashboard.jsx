
import { useState } from "react";

import {
  ShoppingBag,
  Wallet,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({ orders = [], expenses = [] }) {
  const [period, setPeriod] = useState("All Time");

  const formatRs = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const getDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  };

  const today = new Date();

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfPeriod = new Date(startOfToday);

  if (period === "Today") {
    // Aaj ki date
  } else if (period === "Last 7 Days") {
    startOfPeriod.setDate(startOfPeriod.getDate() - 6);
  } else if (period === "This Month") {
    startOfPeriod.setDate(1);
  } else if (period === "This Year") {
    startOfPeriod.setMonth(0, 1);
  } else {
    startOfPeriod.setFullYear(2000, 0, 1);
  }

  const filteredOrders = orders.filter((order) => {
    const date = getDate(order.date);

    return date && date >= startOfPeriod && date <= today;
  });

  const filteredExpenses = expenses.filter((expense) => {
    const date = getDate(expense.date);

    return date && date >= startOfPeriod && date <= today;
  });

  const todayOrders = orders.filter((order) => {
    const date = getDate(order.date);

    return (
      date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  });

  const totalSales = filteredOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const todayRevenue = todayOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const netProfit = totalSales - totalExpenses;

  const stats = [
    {
      title: "Total Sales",
      value: formatRs(totalSales),
      icon: Wallet,
      color: "orange",
    },
    {
      title: "Total Orders",
      value: filteredOrders.length.toLocaleString(),
      icon: ShoppingBag,
      color: "blue",
    },
    {
      title: "Today's Revenue",
      value: formatRs(todayRevenue),
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Net Profit",
      value: formatRs(netProfit),
      icon: Receipt,
      color: "purple",
    },
  ];

 
  const weeklySales = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));

    const daySales = filteredOrders
      .filter((order) => {
        const orderDate = getDate(order.date);

        return (
          orderDate &&
          orderDate.getDate() === date.getDate() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce(
        (total, order) => total + Number(order.total || 0),
        0
      );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      amount: daySales,
    };
  });

  const maxSales = Math.max(
    ...weeklySales.map((sale) => sale.amount),
    1
  );

  // Weekly Sales and Expenses Comparison

  const weeklyComparison = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));

    const sales = filteredOrders
      .filter((order) => {
        const orderDate = getDate(order.date);

        return (
          orderDate &&
          orderDate.getDate() === date.getDate() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce(
        (total, order) => total + Number(order.total || 0),
        0
      );

    const expense = filteredExpenses
      .filter((item) => {
        const expenseDate = getDate(item.date);

        return (
          expenseDate &&
          expenseDate.getDate() === date.getDate() &&
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      sales,
      expense,
    };
  });

  const maxComparison = Math.max(
    ...weeklyComparison.flatMap((item) => [
      item.sales,
      item.expense,
    ]),
    1
  );

  const recentOrders = [...filteredOrders].slice(0, 5);


  return (
    <div className="dashboard">

      <div className="dashboard-welcome">
        <div>
          <h2>Restaurant Overview</h2>
          <p>
            Here is what's happening at your restaurant today.
          </p>
        </div>

        <div className="dashboard-date">
          {today.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Date Filter */}

      <div className="dashboard-filter">
        <div>
          <h3>Dashboard Overview</h3>
          <p>Filter your restaurant performance</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="dashboard-filter-select"
        >
          <option value="Today">Today</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
          <option value="All Time">All Time</option>
        </select>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={21} />
                </div>

                <span className="stat-change up">
                  <ArrowUpRight size={14} />
                  Live
                </span>
              </div>

              <p className="stat-title">{stat.title}</p>

              <h3>{stat.value}</h3>

              <span className="stat-note">
                Based on selected period
              </span>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content-grid">

        <section className="dashboard-panel sales-panel">
          <div className="panel-heading">
            <div>
              <h3>Weekly Sales</h3>
              <p>Sales performance for the last 7 days</p>
            </div>

            <span className="sales-total">
              {formatRs(
                weeklySales.reduce(
                  (total, sale) => total + sale.amount,
                  0
                )
              )}
            </span>
          </div>

          <div className="sales-chart">
            {weeklySales.map((sale, index) => (
              <div className="chart-column" key={sale.day}>
                <div className="chart-bar-area">
                  <div
                    className={`chart-bar ${
                      index === 6 ? "highlight" : ""
                    }`}
                    style={{
                      height: `${
                        sale.amount > 0
                          ? Math.max(
                              (sale.amount / maxSales) * 100,
                              5
                            )
                          : 0
                      }%`,
                    }}
                    title={formatRs(sale.amount)}
                  />
                </div>

                <span>{sale.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel quick-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick Summary</h3>
              <p>Restaurant financial activity</p>
            </div>
          </div>

          <div className="summary-row">
            <span>Total Orders</span>
            <strong>{filteredOrders.length}</strong>
          </div>

          <div className="summary-row">
            <span>Today's Orders</span>
            <strong>{todayOrders.length}</strong>
          </div>

          <div className="summary-row">
            <span>Total Expenses</span>
            <strong>{formatRs(totalExpenses)}</strong>
          </div>

          <div className="summary-row">
            <span>Total Sales</span>
            <strong>{formatRs(totalSales)}</strong>
          </div>

          <div className="summary-row">
            <span>Net Profit</span>
            <strong>{formatRs(netProfit)}</strong>
          </div>
        </section>

      </div>

      <section className="dashboard-panel recent-orders">
        <div className="panel-heading">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest orders in selected period</p>
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Food Item</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => {
                  const itemNames = (order.items || [])
                    .map((item) => item.name);

                  const date = getDate(order.date);

                  return (
                    <tr key={`${order.number}-${index}`}>
                      <td className="order-id">
                        #{order.number}
                      </td>

                      <td>
                        {itemNames.length > 0
                          ? itemNames.join(", ")
                          : "No items"}
                      </td>

                      <td>
                        {date
                          ? date.toLocaleString()
                          : "Date unavailable"}
                      </td>

                      <td className="order-amount">
                        {formatRs(order.total)}
                      </td>

                      <td>
                        <span className="order-status completed">
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No orders available for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
