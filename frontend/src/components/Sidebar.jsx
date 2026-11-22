
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Layers,
  ClipboardList,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Store,
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "POS / New Order", icon: ShoppingCart },
  { name: "Food Management", icon: Utensils },
  { name: "Categories", icon: Layers },
  { name: "Order History", icon: ClipboardList },
  { name: "Orders & Invoices", icon: ClipboardList },
  { name: "Expenses", icon: Wallet },
  { name: "Sales Reports", icon: ChartNoAxesCombined },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Store size={25} />
        </div>

        <div>
          <h2>Royal Refreshment</h2>
          <p>Restaurant Management</p>
        </div>
      </div>

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`sidebar-link ${
                activePage === item.name ? "active" : ""
              }`}
              type="button"
              onClick={() => onNavigate(item.name)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          className={`sidebar-link ${
            activePage === "Settings" ? "active" : ""
          }`}
          type="button"
          onClick={() => onNavigate("Settings")}
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <div className="sidebar-admin">
          <div className="admin-avatar">A</div>

          <div>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
