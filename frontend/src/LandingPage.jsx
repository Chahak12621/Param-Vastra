import React from 'react';
import './LandingPage.css';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Icons for buttons
import { useNavigate } from 'react-router-dom';
import  { useRef } from 'react';


const LandingPage = () => {
  const ctaRef = useRef(null);
  const navigate = useNavigate();

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const goToLogin = () => navigate('/login');
  const goToSignUp = () => navigate('/signup');
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">DivineAttire</div>
        <div className="navbar-right">
          
          
          
          <button className="btn login-btn" onClick={goToLogin}>
            <span className="btn-text">Login</span>
            <FaSignInAlt className="btn-icon" />
          </button>
          <button className="btn signup-btn" onClick={goToSignUp}>
            <span className="btn-text">Sign Up</span>
            <FaUserPlus className="btn-icon" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Unleash Your Elegance</h1>
          <p>
            Discover the vibrant beauty of tradional and indo-western clothing collection on PARAM VASTRA.          </p>
          <button className="btn shop-now" onClick={scrollToCTA}>Shop Now</button>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80"
            alt="Fashion banner"
          />
        </div>
      </section>

      {/* Product Grid */}
      <section className="product-grid">
        <h2>Featured Collections</h2>
        <div className="grid">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80"
            alt="Product 1"
          />
          <img src="/image.jpg" alt="Product 2" />
          <img src="/image.jpg" alt="Product 3" />
          <img
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80"
            alt="Product 4"
          />
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="reviews">
        <h2>What Our Customers Say</h2>
        <div className="review-cards">
          <div className="review">"Super comfy and stylish — 10/10!" - Aisha</div>
          <div className="review">"Fast delivery and excellent quality." - Rahul</div>
          <div className="review">"Love the modern designs!" - Mehak</div>
        </div>
      </section>

      {/* CTA Section */}
       <section className="cta" ref={ctaRef}>
        <h2>Join the Style Revolution</h2>
        <p>
          Already a member? Login to continue shopping. New here? Sign up to get exclusive offers!
        </p>
        <div className="cta-buttons">
           <button className="cta-login" onClick={goToLogin}>

            <span className="cta-btn-text">Login</span>
            
          </button>
            <button className="cta-signin" onClick={goToSignUp}>
            <span className="cta-btn-text">Sign Up</span>
           
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>About Us</div>
          <div>Contact</div>
          <div>Privacy Policy</div>
          <div>Returns & Shipping</div>
        </div>
        <div className="copyright">© {new Date().getFullYear()} StyleSavvy. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default LandingPage;
