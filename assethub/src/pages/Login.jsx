import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect } from "react";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {

        document.title = "Login | AssetHub";
        const user = localStorage.getItem("user");

        if (user) {

            navigate("/dashboard");

        }

    }, [navigate]);

        const handleSubmit = async (e) => {
            e.preventDefault();

            // Clear old tokens before attempting new login
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");

            try {
                const response = await api.post("api/login/", {
                    username: formData.username,
                    password: formData.password,
                });

                // Save new tokens
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);

                // Fetch profile with the new token
                const profile = await api.get("api/profile/", {
                    headers: {
                        Authorization: `Bearer ${response.data.access}`,
                    },
                });

                localStorage.setItem("user", JSON.stringify(profile.data));
                navigate("/dashboard");

            } catch (error) {
                console.error("Login failed:", error.response?.data || error.message);
                alert("Login failed: Please check your username and password.");
            }
        };

    return (

        <div
            style={{
                width: "350px",
                margin: "100px auto",
                padding: "30px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)"
            }}
        >

            <h2 style={{ textAlign: "center" }}>
                AssetHub Login
            </h2>

            <br />

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            username: e.target.value
                        })
                    }
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            password: e.target.value
                        })
                    }
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "20px"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;