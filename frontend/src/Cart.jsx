// src/Cart.jsx
import React, { useEffect, useState } from "react";
import {
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  db,
} from "./firebase";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const userId = localStorage.getItem("uid");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const snap = await getDocs(collection(db, "cart", userId, "items"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
      setLoading(false);
    };
    load();
  }, [userId]);

  const handleQuantityChange = async (item, delta) => {
    const ref = doc(db, "cart", userId, "items", item.id);
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await deleteDoc(ref);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      await setDoc(ref, {
        ...item,
        quantity: newQty,
        updatedAt: new Date(),
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        )
      );
    }
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading) return <div className="loading">Loading cart...</div>;
  if (items.length === 0) return <div className="empty">Your cart is empty.</div>;

  return (
   

    <div className="cart-page">
      <div className="cart-header">
  <button className="home-button" onClick={() => navigate("/home")}>
    🏠 
  </button>
</div>

      <h1>Your Shopping Cart</h1>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.imageurl} alt={item.name} />
            <div className="details">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <div className="qty">
                <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item, 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Subtotal: ₹{subtotal.toFixed(2)}</h2>
        <button
          onClick={() =>
            navigate("/addressform", {
              state: { cartItems: items }, // 🔁 Send cart data
            })
          }
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
