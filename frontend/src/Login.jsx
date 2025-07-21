import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from './firebase'; // adjust path
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            localStorage.setItem('uid', user.uid);
            alert('Login successful!');
            
            navigate('/home');
            // replace with React Router navigation if using
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    const handleForgotPassword = async () => {
        const enteredEmail = prompt('Please enter your email to reset your password:');
        if (enteredEmail) {
            try {
                await sendPasswordResetEmail(auth, enteredEmail);
                alert('Password reset email sent! Check your inbox.');
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome Back</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don&apos;t have an account? <a href="/signup">Sign up here</a>
            </p>
            <p>
                <button onClick={handleForgotPassword} className="forgot-password-btn">
                    Forgot Password?
                </button>
            </p>
        </div>
    );
};

export default Login;
