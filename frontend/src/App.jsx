
import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import FoodManagement from "./pages/FoodManagement";
import Categories from "./pages/Categories";
import OrderHistory from "./pages/OrderHistory";
import OrdersInvoices from "./pages/OrdersInvoices";
import Expenses from "./pages/Expenses";
import SalesReports from "./pages/SalesReports";
import Settings from "./pages/Settings";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [settings, setSettings] = useState({
    name: "Royal Refreshment Center",
    phone: "",
    email: "",
    address: "",
    logo: "",
    footer: "Thank you for visiting us!",
  });

  const [categories, setCategories] = useState([
    "Burgers",
    "Pizza",
    "Snacks",
    "Drinks",
    "Other",
  ]);

  const [foods, setFoods] = useState([
    { id: 1, name: "Chicken Burger", category: "Burgers", price: 450, status: "Available", image: "" },
    { id: 2, name: "Zinger Burger", category: "Burgers", price: 550, status: "Available", image: "" },
    { id: 3, name: "Chicken Pizza", category: "Pizza", price: 1200, status: "Available", image: "" },
    { id: 4, name: "French Fries", category: "Snacks", price: 250, status: "Available", image: "" },
    { id: 5, name: "Cold Drink", category: "Drinks", price: 100, status: "Available", image: "" },
    { id: 6, name: "Tea", category: "Drinks", price: 100, status: "Available", image: "" },
    { id: 7, name: "Coffee", category: "Drinks", price: 250, status: "Available", image: "" },
    { id: 8, name: "Shake", category: "Drinks", price: 250, status: "Available", image: "" },
  ]);

  const [orders, setOrders] = useState([]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Electricity Bill",
      category: "Utilities",
      amount: 8500,
      date: "2026-11-20",
      note: "Monthly electricity bill",
    },
    {
      id: 2,
      title: "Restaurant Rent",
      category: "Rent",
      amount: 25000,
      date: "2026-11-18",
      note: "Monthly shop rent",
    },
    {
      id: 3,
      title: "Cleaning Supplies",
      category: "Supplies",
      amount: 2500,
      date: "2026-11-15",
      note: "Cleaning products",
    },
  ]);

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard orders={orders} expenses={expenses} />;

      case "POS / New Order":
        return (
          <POS
            foods={foods}
            categories={categories}
            settings={settings}
            onOrderComplete={(order) =>
              setOrders((current) => [order, ...current])
            }
          />
        );

      case "Food Management":
        return (
          <FoodManagement
            foods={foods}
            setFoods={setFoods}
            categories={categories}
          />
        );

      case "Categories":
        return (
          <Categories
            categories={categories}
            setCategories={setCategories}
          />
        );

      case "Order History":
        return <OrderHistory orders={orders} />;

      case "Orders & Invoices":
        return <OrdersInvoices orders={orders} />;

      case "Expenses":
        return (
          <Expenses
            expenses={expenses}
            setExpenses={setExpenses}
          />
        );

      case "Sales Reports":
        return (
          <SalesReports
            orders={orders}
            expenses={expenses}
          />
        );

      case "Settings":
        return (
          <Settings
            settings={settings}
            setSettings={setSettings}
          />
        );

      default:
        return (
          <div style={{ padding: "30px" }}>
            <h2>{activePage}</h2>
            <p>This section will be developed in the next steps.</p>
          </div>
        );
    }
  };

  return (
    <div className={`app-layout ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>

      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {mobileMenuOpen && (
        <button
          className="mobile-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className="main-layout">

        <div className="mobile-menu-bar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <strong>Royal Refreshment Center</strong>
        </div>

        <Header />

        <main className="main-content">
          {renderPage()}
        </main>

        <footer className="app-footer">
          © 2026 Royal Refreshment Center. All rights reserved.
        </footer>

      </div>
    </div>
  );
}

export default App;
