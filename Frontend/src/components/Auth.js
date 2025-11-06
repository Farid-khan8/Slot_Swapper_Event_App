import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
            const res = await axios.post(endpoint, form);
            if (isLogin) {
                login(res.data.token, res.data.user);
                alert("Logged in successfully!");
            } else {
                alert("Signed up! Please log in.");
                setIsLogin(true); // Switch to login after signup
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || "An error occurred";
            alert(`Error: ${errorMsg}`);
        }
    };

    return (
        <div className="container">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    required
                />
                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? "Sign Up" : "Login"}
            </button>
        </div>
    );
};

export default Auth;
