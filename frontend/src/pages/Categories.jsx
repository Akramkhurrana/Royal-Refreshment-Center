
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Layers, X } from "lucide-react";
import "./Categories.css";

function Categories({ categories, setCategories }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const closeForm = () => {
    setShowForm(false);
    setEditIndex(null);
    setCategoryName("");
  };

  const saveCategory = (e) => {
    e.preventDefault();

    const name = categoryName.trim();

    if (!name) return;

    const duplicate = categories.some(
      (category, index) =>
        category.toLowerCase() === name.toLowerCase() &&
        index !== editIndex
    );

    if (duplicate) {
      alert("This category already exists.");
      return;
    }

    if (editIndex !== null) {
      setCategories((prev) =>
        prev.map((category, index) =>
          index === editIndex ? name : category
        )
      );
    } else {
      setCategories((prev) => [...prev, name]);
    }

    closeForm();
  };

  const editCategory = (category, index) => {
    setEditIndex(index);
    setCategoryName(category);
    setShowForm(true);
  };

  const deleteCategory = (category) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${category}"?`
      )
    ) {
      setCategories((prev) =>
        prev.filter((item) => item !== category)
      );
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="categories-page">
      <div className="categories-heading">
        <div>
          <span className="categories-eyebrow">
            RESTAURANT MANAGEMENT
          </span>
          <h1>Food Categories</h1>
          <p>Organize and manage your restaurant food categories.</p>
        </div>

        <button
          className="add-category-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={19} /> Add Category
        </button>
      </div>

      <div className="categories-stats">
        <div className="category-stat-card">
          <Layers size={24} />
          <div>
            <span>Total Categories</span>
            <h2>{categories.length}</h2>
          </div>
        </div>
      </div>

      <div className="categories-content">
        <div className="categories-toolbar">
          <div>
            <h2>All Categories</h2>
            <p>Manage your restaurant menu categories.</p>
          </div>

          <div className="category-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="category-grid">
          {filteredCategories.map((category) => {
            const index = categories.indexOf(category);

            return (
              <div className="category-card" key={category}>
                <div className="category-card-icon">
                  <Layers size={24} />
                </div>

                <div className="category-card-info">
                  <h3>{category}</h3>
                  <span>Food Category</span>
                </div>

                <div className="category-card-actions">
                  <button
                    className="edit-category"
                    onClick={() => editCategory(category, index)}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="delete-category"
                    onClick={() => deleteCategory(category)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <p className="category-empty">No categories found.</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="category-modal-overlay">
          <div className="category-modal">
            <div className="category-modal-heading">
              <div>
                <h2>
                  {editIndex !== null ? "Edit Category" : "Add New Category"}
                </h2>
                <p>Enter your food category name.</p>
              </div>

              <button type="button" onClick={closeForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveCategory}>
              <label>Category Name</label>
              <input
                type="text"
                placeholder="e.g. Burgers"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />

              <div className="category-modal-actions">
                <button
                  type="button"
                  className="cancel-category"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="save-category">
                  {editIndex !== null ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
