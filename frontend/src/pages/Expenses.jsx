
import { useState } from "react";
import {
  Plus,
  Search,
  Wallet,
  CalendarDays,
  TrendingDown,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import "./Expenses.css";

function Expenses({ expenses = [], setExpenses }) {
  const emptyForm = {
    title: "",
    category: "Food Purchase",
    amount: "",
    date: new Date().toLocaleDateString("en-CA"),
    note: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const totalExpenses = expenses.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyExpenses = expenses
    .filter((item) => item.date.startsWith(currentMonth))
    .reduce((total, item) => total + Number(item.amount), 0);

  const filteredExpenses = expenses.filter((item) =>
    `${item.title} ${item.category} ${item.note}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveExpense = (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.category ||
      form.amount === "" ||
      Number(form.amount) <= 0 ||
      !form.date
    ) {
      alert("Please enter valid expense details.");
      return;
    }

    const newExpense = {
      ...form,
      id: editId || Date.now(),
      amount: Number(form.amount),
    };

    if (editId) {
      setExpenses((current) =>
        current.map((item) =>
          item.id === editId ? newExpense : item
        )
      );
    } else {
      setExpenses((current) => [newExpense, ...current]);
    }

    setForm(emptyForm);
    setEditId(null);
    setShowModal(false);
  };

  const editExpense = (expense) => {
    setForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date,
      note: expense.note || "",
    });

    setEditId(expense.id);
    setShowModal(true);
  };

  const deleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses((current) =>
        current.filter((item) => item.id !== id)
      );
    }
  };

  return (
    <div className="expenses-page">
      <div className="expenses-heading">
        <div>
          <h2>Expenses Management</h2>
          <p>Track and manage your restaurant expenses.</p>
        </div>

        <button
          className="add-expense-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowModal(true);
          }}
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      <div className="expense-stats">
        <div className="expense-stat-card">
          <div className="expense-stat-icon red">
            <Wallet />
          </div>
          <div>
            <span>Total Expenses</span>
            <h3>Rs. {totalExpenses.toLocaleString()}</h3>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon blue">
            <CalendarDays />
          </div>
          <div>
            <span>This Month</span>
            <h3>Rs. {monthlyExpenses.toLocaleString()}</h3>
          </div>
        </div>

        <div className="expense-stat-card">
          <div className="expense-stat-icon orange">
            <TrendingDown />
          </div>
          <div>
            <span>Total Records</span>
            <h3>{expenses.length}</h3>
          </div>
        </div>
      </div>

      <div className="expenses-table-card">
        <div className="expenses-table-heading">
          <div>
            <h3>Expense Records</h3>
            <p>All restaurant expenses</p>
          </div>

          <div className="expenses-search">
            <Search size={18} />
            <input
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="expenses-table-wrap">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td><strong>{expense.title}</strong></td>
                  <td>{expense.category}</td>
                  <td>{expense.date}</td>
                  <td className="expense-amount">
                    Rs. {Number(expense.amount).toLocaleString()}
                  </td>
                  <td>{expense.note || "-"}</td>
                  <td>
                    <div className="expense-actions">
                      <button
                        className="expense-edit"
                        onClick={() => editExpense(expense)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="expense-delete"
                        onClick={() => deleteExpense(expense.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="6" className="expense-empty">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="expense-modal-overlay">
          <div className="expense-modal">
            <div className="expense-modal-heading">
              <div>
                <h3>{editId ? "Edit Expense" : "Add New Expense"}</h3>
                <p>Enter expense information below.</p>
              </div>

              <button type="button" onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={saveExpense}>
              <label>Expense Title</label>
              <input
                name="title"
                value={form.title}
                onChange={updateForm}
                placeholder="e.g. Electricity Bill"
                required
              />

              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={updateForm}
              >
                <option>Food Purchase</option>
                <option>Utilities</option>
                <option>Rent</option>
                <option>Staff Salary</option>
                <option>Supplies</option>
                <option>Maintenance</option>
                <option>Transportation</option>
                <option>Other</option>
              </select>

              <div className="expense-form-row">
                <div>
                  <label>Amount (Rs.)</label>
                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={updateForm}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={updateForm}
                    required
                  />
                </div>
              </div>

              <label>Note (Optional)</label>
              <textarea
                name="note"
                value={form.note}
                onChange={updateForm}
                placeholder="Write expense details..."
                rows="3"
              />

              <div className="expense-modal-actions">
                <button
                  type="button"
                  className="expense-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="expense-save">
                  {editId ? "Update Expense" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;
