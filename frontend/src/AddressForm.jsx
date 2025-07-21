import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, db } from "./firebase";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddressForm.css";

const AddressForm = () => {
  const userId = localStorage.getItem("uid");
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;
  const cartItems = location.state?.cartItems;

  const [form, setForm] = useState({
    fullName: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const snap = await getDoc(doc(db, "users", userId, "address", "main"));
      if (snap.exists()) setForm(snap.data());
      setLoading(false);
    };
    load();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "users", userId, "address", "main"), form);
    alert("Saved your address!");
    navigate("/payment");
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the order?");
    if (confirmCancel) {
      if (product) {
        navigate(`/product/${product.id}`);
      } else {
        navigate("/cart");
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="address-page">
      <h1>Shipping Address</h1>

      {/* Show either cart summary OR product summary */}
      {cartItems ? (
        <div className="cart-summary">
          <h3>Your Cart Summary:</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-summary-item">
              <img
                src={item.imageurl}
                alt={item.name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <div>
                <strong>{item.name}</strong> x {item.quantity}
                <br />
                ₹{item.price} each (₹{item.price * item.quantity})
              </div>
            </div>
          ))}
          <hr />
          <h4>
            Total: ₹
            {cartItems
              .reduce((sum, i) => sum + i.price * i.quantity, 0)
              .toFixed(2)}
          </h4>
        </div>
      ) : product ? (
        <div className="product-summary">
          <h3>You're buying:</h3>
          <p>
            <strong>{product.name}</strong>
          </p>
          <p>Price: ₹{product.price}</p>
          <img
            src={product.imageurl}
            alt={product.name}
            style={{ width: "100px", height: "auto", borderRadius: "4px" }}
          />
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Address Line
          <textarea name="addressLine" value={form.addressLine} onChange={handleChange} required />
        </label>
        <label>
          City
          <input name="city" value={form.city} onChange={handleChange} required />
        </label>
        <label>
          State
          <input name="state" value={form.state} onChange={handleChange} required />
        </label>
        <label>
          Pincode
          <input name="pincode" value={form.pincode} onChange={handleChange} required />
        </label>
        <label>
          Phone Number
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>

        <div className="form-buttons">
          <button type="submit">Save & Continue</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
