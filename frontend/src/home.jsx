import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";

import {
  db,
  collection,
  getDocs,
  query,
  setDoc,
  doc,
  getDoc,
} from "./firebase";
import "./home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartProductIds, setCartProductIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const userId = localStorage.getItem("uid");

  useEffect(() => {
    if (!userId) alert("You're not logged in! Please log in to add to cart.");
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const loaded = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(loaded);
  };

  const loadCart = async () => {
    if (!userId) return;
    const cartSnapshot = await getDocs(collection(db, "cart", userId, "items"));
    const ids = cartSnapshot.docs.map((doc) => doc.id);
    setCartProductIds(ids);
  };

  const handleAddToCart = async (product) => {
    if (!userId) {
      alert("Please log in to add to cart.");
      return;
    }

    const itemRef = doc(db, "cart", userId, "items", product.id);
    const snap = await getDoc(itemRef);

    if (snap.exists()) {
      const existing = snap.data();
      await setDoc(itemRef, {
        ...existing,
        quantity: existing.quantity + 1,
        updatedAt: new Date(),
      });
    } else {
      await setDoc(itemRef, {
        name: product.name,
        price: product.price,
        imageurl: product.imageurl,
        quantity: 1,
        addedAt: new Date(),
      });
    }

    loadCart();
  };

  const handleInputChange = async (e) => {
    const term = e.target.value.trim().toLowerCase();
    setSearchTerm(term);

    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    const snapshot = await getDocs(query(collection(db, "products")));
    const matches = snapshot.docs
      .map((doc) => doc.data().name?.toLowerCase())
      .filter((name) => name && name.includes(term));

    const combined = [...new Set(matches)].slice(0, 10);
    setSuggestions(combined);
  };

  const searchProducts = async (term) => {
    const lowerTerm = term.trim().toLowerCase();
    if (lowerTerm.length < 2) {
      loadProducts();
      return;
    }

    const snapshot = await getDocs(query(collection(db, "products")));
    const matched = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((product) => product.name?.toLowerCase().includes(lowerTerm));

    setProducts(matched);
    setSuggestions([]);
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <div className="logo">ParamVastra</div>

        <div className="top-icons">
          <span className="icon-link" onClick={() => setShowSearch(!showSearch)}>  <FaSearch size={20} /></span>
          <Link className="icon-link" to="/cart"><FaShoppingCart size={20} /></Link>
          <Link className="icon-link" to="/profile"><FaUserCircle size={20} /></Link>
        </div>

        {showSearch && (
          <div className="search-bar active">
            <input
              type="text"
              placeholder="Search clothing..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <div className="suggestions-box">
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => searchProducts(s)}>{s}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="products-container">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => {
            const isInCart = cartProductIds.includes(product.id);

            return (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <img src={product.imageurl} alt={product.name} />
                  <div className="name-price-row">
                    <h3>{product.name}</h3>
                    <span style={{ color: "red" }} className="price">₹{product.price}</span>
                  </div>

                </Link>
                <button
                  className="add-to-cart"
                  onClick={() => handleAddToCart(product)}
                  disabled={isInCart}
                >
                  {isInCart ? "✅ In Cart" : "Add to Cart 🛒"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
