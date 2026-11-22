
import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Boxes,
  X,
  Trash2,
  Pencil,
} from "lucide-react";

import "./Inventory.css";

function Inventory() {
  const [items, setItems] = useState([
    { id: 1, name: "Chicken", category: "Meat", quantity: 15, unit: "kg", minimum: 5 },
    { id: 2, name: "Flour", category: "Grocery", quantity: 25, unit: "kg", minimum: 10 },
    { id: 3, name: "Cooking Oil", category: "Grocery", quantity: 3, unit: "Litre", minimum: 5 },
    { id: 4, name: "Cold Drinks", category: "Drinks", quantity: 40, unit: "Pcs", minimum: 10 },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    name: "",
    category: "",
    quantity: "",
    unit: "kg",
    minimum: "",
  };

  const [form, setForm] = useState(emptyForm);

  const lowStock = items.filter(
    (item) => item.quantity <= item.minimum
  ).length;

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveItem = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      form.quantity === "" ||
      form.minimum === "" ||
      Number(form.quantity) < 0 ||
      Number(form.minimum) < 0
    ) {
      alert("Please enter valid inventory details.");
      return;
    }

    const newItem = {
      ...form,
      id: editId || Date.now(),
      quantity: Number(form.quantity),
      minimum: Number(form.minimum),
    };

    if (editId) {
      setItems((current) =>
        current.map((item) => item.id === editId ? newItem : item)
      );
    } else {
      setItems((current) => [...current, newItem]);
    }

    setForm(emptyForm);
    setEditId(null);
    setShowModal(false);
  };

  const editItem = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      quantity: String(item.quantity),
      unit: item.unit,
      minimum: String(item.minimum),
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const deleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems((current) => current.filter((item) => item.id !== id));
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div>
          <h2>Inventory Management</h2>
          <p>Manage your restaurant stock and supplies</p>
        </div>

        <button
          className="inventory-add-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowModal(true);
          }}
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="inventory-stats">
        <div className="inventory-stat-card">
          <div className="inventory-stat-icon blue"><Package /></div>
          <div><span>Total Items</span><h3>{items.length}</h3></div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon green"><Boxes /></div>
          <div><span>Stock Available</span><h3>{items.filter(i => i.quantity > i.minimum).length}</h3></div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon orange"><AlertTriangle /></div>
          <div><span>Low Stock Alerts</span><h3>{lowStock}</h3></div>
        </div>
      </div>

      <div className="inventory-table-card">
        <div className="inventory-table-heading">
          <div>
            <h3>Stock Items</h3>
            <p>View and manage all inventory items</p>
          </div>

          <div className="inventory-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Minimum Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{item.minimum} {item.unit}</td>
                  <td>
                    <span className={
                      item.quantity <= item.minimum
                        ? "stock-status low"
                        : "stock-status available"
                    }>
                      {item.quantity <= item.minimum ? "Low Stock" : "Available"}
                    </span>
                  </td>
                  <td>
                    <div className="inventory-actions">
                      <button className="edit-stock" onClick={() => editItem(item)} title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button className="delete-stock" onClick={() => deleteItem(item.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="inventory-empty">
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="inventory-modal-overlay">
          <div className="inventory-modal">
            <div className="inventory-modal-header">
              <div>
                <h3>{editId ? "Edit Inventory Item" : "Add Inventory Item"}</h3>
                <p>Enter stock item details below</p>
              </div>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form onSubmit={saveItem}>
              <label>Item Name</label>
              <input name="name" value={form.name} onChange={updateForm} placeholder="e.g. Chicken" required />

              <label>Category</label>
              <input name="category" value={form.category} onChange={updateForm} placeholder="e.g. Meat" required />

              <div className="inventory-form-row">
                <div>
                  <label>Quantity</label>
                  <input type="number" min="0" step="any" name="quantity" value={form.quantity} onChange={updateForm} placeholder="0" required />
                </div>
                <div>
                  <label>Unit</label>
                  <select name="unit" value={form.unit} onChange={updateForm}>
                    <option value="kg">Kg</option>
                    <option value="Litre">Litre</option>
                    <option value="Pcs">Pieces</option>
                    <option value="Packet">Packet</option>
                    <option value="Box">Box</option>
                  </select>
                </div>
              </div>

              <label>Minimum Stock Alert</label>
              <input type="number" min="0" step="any" name="minimum" value={form.minimum} onChange={updateForm} placeholder="e.g. 5" required />

              <div className="inventory-modal-buttons">
                <button type="button" className="inventory-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="inventory-save">{editId ? "Update Item" : "Save Item"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
