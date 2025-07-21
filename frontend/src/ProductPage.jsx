import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {FaShoppingCart, FaUserCircle } from "react-icons/fa";
import {
  db,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from "./firebase";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const userId = localStorage.getItem("uid");
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [editing, setEditing] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      

      <>
        {"★".repeat(full)}
        {half && "½"}
        {"☆".repeat(empty)}
      </>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const productSnap = await getDoc(doc(db, "products", productId));
      if (!productSnap.exists()) return setProduct(null);
      setProduct({ id: productSnap.id, ...productSnap.data() });

      const reviewsRef = collection(db, "products", productId, "reviews");
      const reviewSnap = await getDocs(query(reviewsRef, orderBy("createdAt", "desc")));
      const rawReviews = reviewSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const enriched = await Promise.all(
        rawReviews.map(async (r) => {
          try {
            const addressDoc = await getDoc(doc(db, "users", r.userId, "address", "main"));
            const fullName = addressDoc.exists()
              ? addressDoc.data().fullName
              : "Anonymous";
            return { ...r, fullName };
          } catch (error) {
            console.error("Error fetching fullName for user:", error);
            return { ...r, fullName: "Anonymous" };
          }
        })
      );


      setReviews(enriched);
      const avg = enriched.length
        ? (enriched.reduce((sum, r) => sum + r.rating, 0) / enriched.length).toFixed(1)
        : 0;
      setAverageRating(avg);

      const existing = enriched.find((r) => r.userId === userId);
      if (existing) {
        setUserHasReviewed(true);
        setUserRating(existing.rating);
        setUserComment(existing.comment);
      }

      if (userId) {
        const cartItem = await getDoc(doc(db, "cart", userId, "items", productId));
        setIsInCart(cartItem.exists());
      }

      setLoading(false);
    };

    fetchData();
  }, [productId, userId]);

  const handleAddToCart = async () => {
    if (!userId) return alert("Please log in first.");

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

    setIsInCart(true);
  };

  const handleBuyNow = () => {
    if (!userId) return alert("Please log in to continue.");
    alert("Proceed to payment or checkout page.");
    navigate("/addressform", { state: { product } });

  };

  const handleSubmit = async () => {
    if (!userRating || !userComment.trim()) {
      return alert("Please fill in both rating and comment.");
    }

    await setDoc(doc(db, "products", productId, "reviews", userId), {
      userId,
      rating: userRating,
      comment: userComment.trim(),
      createdAt: serverTimestamp(),
    });

    setEditing(false);
    setUserHasReviewed(true);
    window.location.reload();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="not-found">Product not found.</div>;

  return (
    <div className="product-page">
      <div className="top-bar">
  <div className="logo" onClick={() => navigate("/")}>ParamVastra</div>

  <div className="top-icons">
    <Link className="icon-link" to="/cart"><FaShoppingCart size={20}/></Link>
    <Link className="icon-link" to="/profile"><FaUserCircle size={20} /></Link>
  </div>
</div>

      <div className="product-header">
        <img src={product.imageurl} alt={product.name} />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h3 style={{ color: "red" }}>Price: ₹{product.price}</h3>
          <div className="average-rating">
            Average Rating: {renderStars(averageRating)} ({averageRating}⭐)
          </div>
          <div className="product-actions">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? "✅ In Cart" : "Add to Cart 🛒"}
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now ⚡
            </button>
          </div>
        </div>
      </div>

      <hr />
      <h2>Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="stars">{renderStars(r.rating)} ({r.rating}⭐)</div>
              <p>{r.comment}</p>
              <div className="reviewer">— {r.fullName}</div>
              {r.userId === userId && !editing && (
                <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
              )}
            </div>
          ))}
        </div>
      )}

      <hr />
      <div className="review-form">
        {userHasReviewed && !editing ? (
          <p className="already-reviewed">✅ You’ve already submitted a review.</p>
        ) : (
          <>
            <h3>{editing ? "Edit Your Review" : "Leave a Review"}</h3>
            <div className="rating-select">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setUserRating(s)}
                  style={{
                    cursor: "pointer",
                    color: s <= userRating ? "gold" : "lightgray",
                    fontSize: "24px",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Write your thoughts..."
              rows="4"
            />
            <button onClick={handleSubmit}>
              {editing ? "Update Review" : "Submit Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
