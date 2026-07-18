import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Assignments() {

    const [assignments, setAssignments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        asset: "",
        employee: "",
        date_assigned: "",
        date_returned: "",
    });

    const [editId, setEditId] = useState(null);

    const [search, setSearch] = useState("");

    useEffect(() => {
        document.title = "Assignments | AssetHub";
        fetchAssignments();
        fetchAssets();
        fetchUsers();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await api.get("/api/assignments/");
            console.log("Assignments:", response.data);
            // Handle both paginated and non-paginated responses
            setAssignments(response.data.results || response.data);
        } catch (error) {
            console.error("Error:", error.response?.data);
        }
    };

    const fetchAssets = async () => {
        try {
            const response = await api.get("/api/assets/");
            setAssets(response.data.results || response.data);
        } catch (error) {
            console.error("Error:", error.response?.data);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/users/");
            setUsers(response.data.results || response.data);
        } catch (error) {
            console.error("Error:", error.response?.data);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log("📤 Sending data:", formData);

        if (
            !formData.asset ||
            !formData.employee ||
            !formData.date_assigned
        ) {
            alert("Please fill all required fields.");
            return;
        }

        if (
            formData.date_returned &&
            formData.date_returned < formData.date_assigned
        ) {
            alert("Return date cannot be earlier than assigned date.");
            return;
        }

        try {
            if (editId) {
                await api.put(`api/assignments/${editId}/`, formData);
            } else {
                const response = await api.post("api/assignments/", formData);
                console.log("✅ Success:", response.data);
            }
            
            fetchAssignments();
            setFormData({
                asset: "",
                employee: "",
                date_assigned: "",
                date_returned: "",
            });
            setEditId(null);
            
        } catch (error) {
            console.error("❌ POST failed:");
            console.error("Status:", error.response?.status);
            console.error("Data:", error.response?.data);  // ← This will show the validation errors!
            console.error("Sent data:", formData);
            alert("Failed to create assignment. Check console for details.");
        }
    const handleEdit = (assignment) => {

        setFormData({

            asset: assignment.asset,

            employee: assignment.employee,

            date_assigned: assignment.date_assigned,

            date_returned: assignment.date_returned || "",

        });

        setEditId(assignment.id);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete Assignment?"))
            return;

        await api.delete(`api/assignments/${id}/`);

        fetchAssignments();

    };

    const filteredAssignments = assignments.filter((item) =>

        item.asset_name.toLowerCase().includes(search.toLowerCase()) ||

        item.employee_name.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <div>

            <Sidebar />

            <Navbar />

            <div className="main-content">

                <h2>Asset Assignments</h2>

                <br />

                <form onSubmit={handleSubmit} autoComplete="off">

                    <select

                        value={formData.asset}

                        onChange={(e)=>

                            setFormData({

                                ...formData,

                                asset:e.target.value

                            })

                        }

                    >

                        <option value="">Select Asset</option>

                        {

                            assets.map(asset=>(

                                <option

                                    key={asset.id}

                                    value={asset.id}

                                >

                                    {asset.name}

                                </option>

                            ))

                        }

                    </select>

                    &nbsp;

                    <select

                        value={formData.employee}

                        onChange={(e)=>

                            setFormData({

                                ...formData,

                                employee:e.target.value

                            })

                        }

                    >

                        <option value="" disabled>Select Employee</option>

                        {

                            users.map(user=>(

                                <option

                                    key={user.id}

                                    value={user.id}

                                >

                                    {user.username}

                                </option>

                            ))

                        }

                    </select>

                    &nbsp;

                    <input

                        type="date"

                        value={formData.date_assigned}

                        onChange={(e)=>

                            setFormData({

                                ...formData,

                                date_assigned:e.target.value

                            })

                        }
                        required

                    />

                    &nbsp;

                    <input

                        type="date"

                        value={formData.date_returned}

                        onChange={(e)=>

                            setFormData({

                                ...formData,

                                date_returned:e.target.value

                            })

                        }
                        required

                    />

                    &nbsp;

                    <button
                        className="add-btn"
                        type="submit"
                    >

                        {

                            editId

                            ? "Update"

                            : "Assign"

                        }

                    </button>

                </form>

                <br />

                <input

                    type="text"

                    className="search-box"

                    placeholder="Search Assignment..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                />

                <table className="asset-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Asset</th>

                            <th>Employee</th>

                            <th>Assigned</th>

                            <th>Returned</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                   <tbody>

                    {
                        filteredAssignments.length === 0 ? (

                            <tr>
                                <td colSpan="6" className="no-data">
                                    No Assignments Found
                                </td>
                            </tr>

                        ) : (

                            filteredAssignments.map((assignment) => (

                                <tr key={assignment.id}>

                                    <td>{assignment.id}</td>

                                    <td>{assignment.asset_name}</td>

                                    <td>{assignment.employee_name}</td>

                                    <td>{assignment.date_assigned}</td>

                                    <td>{assignment.date_returned || "-"}</td>

                                    <td>

                                        <button
                                            onClick={() => handleEdit(assignment)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(assignment.id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )
                    }

                    </tbody>

                </table>

            </div>

        </div>

    );

}
}

export default Assignments;