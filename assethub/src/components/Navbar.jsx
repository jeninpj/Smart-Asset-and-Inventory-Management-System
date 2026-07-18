import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {

        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        navigate("/", { replace: true });

    };

    return (
        <div className="navbar">
            <h2>Asset Management System</h2>
            <div>
                <span>
                    Welcome, {user?.username}
                </span>
                &nbsp;&nbsp;
                <button
                    onClick={handleLogout}
                    style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>

            </div>

        </div>

    );

}

export default Navbar;