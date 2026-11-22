
import React, { useState } from "react";
import {
  Plus, Search, Pencil, Trash2, UtensilsCrossed,
  X, Upload, ImagePlus
} from "lucide-react";
import "./FoodManagement.css";

function FoodManagement({ foods, setFoods, categories }) {


  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    name: "",
    category: "Burgers",
    price: "",
    status: "Available",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const saveFood = (e) => {
    e.preventDefault();

    if (!form.name.trim() || Number(form.price) <= 0) {
      alert("Please enter a valid food name and price.");
      return;
    }

    if (editId) {
      setFoods((prev) =>
        prev.map((food) =>
          food.id === editId
            ? { ...food, ...form, price: Number(form.price) }
            : food
        )
      );
    } else {
      setFoods((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          price: Number(form.price),
        },
      ]);
    }

    closeForm();
  };

  const editFood = (food) => {
    setEditId(food.id);
    setForm({
      name: food.name,
      category: food.category,
      price: String(food.price),
      status: food.status,
      image: food.image || "",
    });
    setShowForm(true);
  };

  const deleteFood = (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      setFoods((prev) => prev.filter((food) => food.id !== id));
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="food-page">
      <div className="food-heading">
        <div>
          <span className="food-eyebrow">RESTAURANT MANAGEMENT</span>
          <h1>Food Management</h1>
          <p>Manage your restaurant menu and food prices.</p>
        </div>

        <button className="add-food-btn" onClick={() => setShowForm(true)}>
          <Plus size={19} /> Add New Food
        </button>
      </div>

      <div className="food-stats">
        <div className="food-stat-card">
          <span>Total Food Items</span>
          <h2>{foods.length}</h2>
        </div>
        <div className="food-stat-card">
          <span>Available Items</span>
          <h2>{foods.filter((f) => f.status === "Available").length}</h2>
        </div>
        <div className="food-stat-card">
          <span>Categories</span>
          <h2>{new Set(foods.map((f) => f.category)).size}</h2>
        </div>
      </div>

      <div className="food-content">
        <div className="food-toolbar">
          <div>
            <h2>Food Menu</h2>
            <p>All restaurant food items</p>
          </div>

          <div className="food-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="food-table-wrap">
          <table className="food-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFoods.map((food) => (
                <tr key={food.id}>
                  <td>
                    <div className="food-name">
                      {food.image ? (
                        <img src={food.image} alt={food.name} className="food-item-image" />
                      ) : (
                        <span className="food-icon">
                          <UtensilsCrossed size={19} />
                        </span>
                      )}
                      <strong>{food.name}</strong>
                    </div>
                  </td>
                  <td>{food.category}</td>
                  <td className="food-price">
                    Rs. {food.price.toLocaleString()}
                  </td>
                  <td>
                    <span className={`food-status ${food.status === "Available" ? "available" : "unavailable"}`}>
                      {food.status}
                    </span>
                  </td>
                  <td>
                    <div className="food-actions">
                      <button className="edit-food" onClick={() => editFood(food)} title="Edit">
                        <Pencil size={17} />
                      </button>
                      <button className="delete-food" onClick={() => deleteFood(food.id)} title="Delete">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFoods.length === 0 && (
                <tr>
                  <td colSpan="5" className="food-empty">No food items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="food-modal-overlay">
          <div className="food-modal">
            <div className="food-modal-heading">
              <div>
                <h2>{editId ? "Edit Food Item" : "Add New Food"}</h2>
                <p>Enter food item details below.</p>
              </div>
              <button type="button" onClick={closeForm}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveFood}>
              <label>Food Name</label>
              <input
                type="text"
                placeholder="Enter food name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label>Price (Rs.)</label>
              <input
                type="number"
                min="1"
                placeholder="Enter price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />

              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Available</option>
                <option>Unavailable</option>
              </select>

              <label>Food Image</label>
              <div className="food-image-upload">
                {form.image ? (
                  <div className="food-image-preview">
                    <img src={form.image} alt="Food preview" />
                    <button
                      type="button"
                      className="remove-food-image"
                      onClick={() => setForm({ ...form, image: "" })}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="food-upload-label">
                    <ImagePlus size={30} />
                    <strong>Upload Food Picture</strong>
                    <span>PNG, JPG or JPEG (Maximum 5 MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      hidden
                    />
                    <span className="food-upload-button">
                      <Upload size={16} /> Choose Image
                    </span>
                  </label>
                )}
              </div>

              <div className="food-modal-actions">
                <button type="button" className="cancel-food" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="save-food">
                  {editId ? "Update Food" : "Save Food"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodManagement;
