import {
  Search,
  Bell,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import "./Header.css";

function Header() {
  return (
    <header className="top-header">
      <div className="header-left">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your restaurant overview.</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={18} />
          <input type="text" placeholder="Search anything..." />
        </div>

        <div className="header-date">
          <CalendarDays size={17} />
          <span>Today</span>
        </div>

        <button className="notification-btn" type="button">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile">
          <div className="profile-avatar">A</div>
          <div className="profile-details">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default Header;