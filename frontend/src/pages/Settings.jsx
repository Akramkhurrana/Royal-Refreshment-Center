
import { useState } from "react";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  ImagePlus,
  Save,
} from "lucide-react";

import "./Settings.css";

function Settings({ settings, setSettings }) {
  const [form, setForm] = useState(settings);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        logo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const saveSettings = (e) => {
    e.preventDefault();

    setSettings(form);
    alert("Restaurant settings saved successfully!");
  };

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <h2>Restaurant Settings</h2>
          <p>Manage your restaurant information and invoice details.</p>
        </div>
      </div>

      <form className="settings-form" onSubmit={saveSettings}>
        <div className="settings-card">
          <div className="settings-card-heading">
            <Store size={21} />
            <div>
              <h3>Restaurant Information</h3>
              <p>Basic information about your restaurant.</p>
            </div>
          </div>

          <div className="settings-logo-section">
            <div className="settings-logo-preview">
              {form.logo ? (
                <img src={form.logo} alt="Restaurant Logo" />
              ) : (
                <Store size={35} />
              )}
            </div>

            <div>
              <strong>Restaurant Logo</strong>
              <p>Upload your restaurant logo.</p>

              <label className="settings-upload-btn">
                <ImagePlus size={17} />
                Choose Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogo}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="settings-fields">
            <div className="settings-field">
              <label>Restaurant Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Restaurant name"
                required
              />
            </div>

            <div className="settings-field">
              <label>Phone Number</label>
              <div className="settings-input-icon">
                <Phone size={17} />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>

            <div className="settings-field">
              <label>Email Address</label>
              <div className="settings-input-icon">
                <Mail size={17} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="restaurant@example.com"
                />
              </div>
            </div>

            <div className="settings-field full-width">
              <label>Restaurant Address</label>
              <div className="settings-input-icon">
                <MapPin size={17} />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter restaurant address"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-heading">
            <Store size={21} />
            <div>
              <h3>Invoice Settings</h3>
              <p>Customize the information shown on printed bills.</p>
            </div>
          </div>

          <div className="settings-fields">
            <div className="settings-field full-width">
              <label>Invoice Footer Message</label>
              <textarea
                name="footer"
                value={form.footer}
                onChange={handleChange}
                placeholder="Thank you for visiting us!"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="settings-save-area">
          <button type="submit" className="settings-save-btn">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
