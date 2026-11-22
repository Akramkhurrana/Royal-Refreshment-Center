
import { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Receipt,
  X,
} from "lucide-react";

import "./POS.css";
import Invoice from "./Invoice";

function POS({
  foods = [],
  categories = [],
  onOrderComplete,
  settings = {},
}) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [orderNumber, setOrderNumber] = useState(1001);
  const [completedOrder, setCompletedOrder] = useState(null);

  const products = foods
    .filter((food) => food.status === "Available")
    .map((food) => ({
      ...food,
      Image: food.image || food.Image || "",
    }));

  const allCategories = ["All", ...categories];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const completeOrder = () => {
    const paid = Number(paidAmount);

    if (!Number.isFinite(paid) || paid < subtotal) {
      alert(
        "Please enter a valid paid amount equal to or greater than the total."
      );
      return;
    }

    const order = {
      number: orderNumber,
      items: cart,
      total: subtotal,
      paid,
      balance: paid - subtotal,
      paymentMethod,
      date: new Date().toLocaleString(),
    };

    setCompletedOrder(order);

    onOrderComplete?.(order);

    setOrderNumber((number) => number + 1);
    setCart([]);
    setPaidAmount("");
    setShowPayment(false);
  };

  return (
    <div className="pos-page">
      <div className="pos-heading">
        <div>
          <h2>New Order</h2>
          <p>Select food items and create a restaurant order.</p>
        </div>

        <div className="pos-order-label">
          <Receipt size={18} />
          New Sale
        </div>
      </div>

      <div className="pos-layout">
        <section className="pos-menu">
          <div className="pos-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search food items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="pos-categories">
            {allCategories.map((item) => (
              <button
                key={item}
                className={category === item ? "selected" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="pos-products">
            {filteredProducts.map((product) => (
              <button
                className="pos-product-card"
                key={product.id}
                onClick={() => addToCart(product)}
              >
                {product.Image ? (
                  <img
                    src={product.Image}
                    alt={product.name}
                    className="product-emoji"
                  />
                ) : (
                  <div className="product-emoji">
                    <span>🍽️</span>
                  </div>
                )}

                <strong>{product.name}</strong>

                <span className="product-category">
                  {product.category}
                </span>

                <div className="product-card-bottom">
                  <b>
                    Rs. {Number(product.price).toLocaleString()}
                  </b>

                  <span className="product-add">
                    <Plus size={17} />
                  </span>
                </div>
              </button>
            ))}

            {filteredProducts.length === 0 && (
              <p className="pos-empty">
                No food items found.
              </p>
            )}
          </div>
        </section>

        <aside className="pos-cart">
          <div className="cart-heading">
            <div>
              <h3>Current Order</h3>
              <p>{cart.length} different items</p>
            </div>

            <ShoppingCart size={21} />
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingCart size={35} />
                <strong>Your cart is empty</strong>
                <span>
                  Select food items to start an order.
                </span>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>
                      Rs. {Number(item.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, -1)
                      }
                    >
                      <Minus size={13} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, 1)
                      }
                    >
                      <Plus size={13} />
                    </button>

                    <button
                      className="cart-delete"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <strong className="cart-item-total">
                    Rs.{" "}
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString()}
                  </strong>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <strong>
                Rs. {subtotal.toLocaleString()}
              </strong>
            </div>

            <div className="cart-grand-total">
              <span>Total</span>
              <strong>
                Rs. {subtotal.toLocaleString()}
              </strong>
            </div>

            <button
              className="place-order-btn"
              disabled={cart.length === 0}
              onClick={() => setShowPayment(true)}
            >
              Place Order
            </button>
          </div>
        </aside>
      </div>

      {showPayment && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <button
              className="payment-close"
              onClick={() => setShowPayment(false)}
            >
              <X size={20} />
            </button>

            <h2>Complete Payment</h2>
            <p>Order #{orderNumber}</p>

            <div className="payment-total">
              <span>Total Bill</span>
              <strong>
                Rs. {subtotal.toLocaleString()}
              </strong>
            </div>

            <label>Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option>Cash</option>
              <option>Card</option>
              <option>Easypaisa</option>
              <option>JazzCash</option>
            </select>

            <label>Paid Amount (Rs.)</label>

            <input
              type="number"
              min={subtotal}
              placeholder="Enter paid amount"
              value={paidAmount}
              onChange={(e) =>
                setPaidAmount(e.target.value)
              }
            />

            <button
              className="confirm-payment-btn"
              onClick={completeOrder}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {completedOrder && (
        <Invoice
          order={completedOrder}
          settings={settings}
          onClose={() => setCompletedOrder(null)}
        />
      )}
    </div>
  );
}

export default POS;
