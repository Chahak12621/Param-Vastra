import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  db,
  collection,
} from "./firebase";
import { auth, sendPasswordResetEmail } from "./firebase";
import { useNavigate } from "react-router-dom";

import "./Profile.css";


const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("uid");

  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      const currentUser = auth.currentUser;
      if (currentUser) {
        setEmail(currentUser.email);
      }

      const profileRef = doc(db, "users", userId, "address", "main");
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
        setExists(true);
      } else {
        setExists(false);
        setEditing(true); // allow adding new profile
      }

      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;

    // Ensure parent doc exists before setting address/main
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {}, { merge: true }); // Create empty doc if not exist

    const addressRef = doc(db, "users", userId, "address", "main");
    await setDoc(addressRef, profile, { merge: true });

    alert(exists ? "Profile updated!" : "Profile created!");
    setExists(true);
    setEditing(false);
  };

  const handleResetPassword = async () => {
    if (!email) return alert("Email not found.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    
     
    <div className="profile-page">
       <button 
        className="home-button"
        onClick={() => navigate("/home")}
        style={{ marginBottom: "1rem" }}
      >
        🏠 Home
      </button>

      <h1>{exists ? "My Profile" : "Create Profile"}</h1>


      <label>
        Full Name
        <input
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <label>
        Email
        <input value={email} disabled />
      </label>

      <label>
        Phone Number
        <input
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <h3>Address Details</h3>

      <label>
        Address Line
        <textarea
          name="addressLine"
          value={profile.addressLine}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <label>
        City
        <input
          name="city"
          value={profile.city}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <label>
        State
        <input
          name="state"
          value={profile.state}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <label>
        Pincode
        <input
          name="pincode"
          value={profile.pincode}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <div className="buttons">
        {editing ? (
          <>
            <button onClick={handleSave}>
              {exists ? "Save Changes" : "Add Profile"}
            </button>
            {exists && (
              <button onClick={() => setEditing(false)}>Cancel</button>
            )}
          </>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}

        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </div>
  );
};

export default Profile;
