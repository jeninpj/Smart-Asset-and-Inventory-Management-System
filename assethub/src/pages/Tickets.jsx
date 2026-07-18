import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Tickets() {

    const [tickets, setTickets] = useState([]);
    const [assets, setAssets] = useState([]);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        asset: "",
        issue: "",
        status: "Open",
        assigned_technician: "",
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        document.title = "Tickets | AssetHub";
        fetchTickets();
        fetchAssets();
        fetchUsers();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await api.get("api/tickets/");
            setTickets(response.data.results);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAssets = async () => {
        try {
            const response = await api.get("api/assets/");
            setAssets(response.data.results);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get("api/users/");
            setUsers(response.data.results);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.asset ||
            !formData.issue.trim() ||
            !formData.assigned_technician
        ) {
            alert("Please fill all fields.");
            return;
        }

        try {

            if (editId) {

                await api.put(
                    `api/tickets/${editId}/`,
                    formData
                );

            } else {

                await api.post(
                    "api/tickets/",
                    formData
                );

            }

            fetchTickets();

            setFormData({
                asset: "",
                issue: "",
                status: "Open",
                assigned_technician: "",
            });

            setEditId(null);

        } catch (error) {

            console.log(error);

        }
    };

    const handleEdit = (ticket) => {

        setFormData({
            asset: ticket.asset,
            issue: ticket.issue,
            status: ticket.status,
            assigned_technician: ticket.assigned_technician,
        });

        setEditId(ticket.id);
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this ticket?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`api/tickets/${id}/`);

            fetchTickets();

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div>

            <Sidebar />

            <Navbar />

            <div className="main-content">

                <h2>Repair Tickets</h2>

                <br />

                <form onSubmit={handleSubmit} autoComplete="off">

                    <select
                        value={formData.asset}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                asset: e.target.value,
                            })
                        }
                        required
                    >

                        <option value="" disabled>
                            Select Asset
                        </option>

                        {assets.map((asset) => (

                            <option
                                key={asset.id}
                                value={asset.id}
                            >
                                {asset.name}
                            </option>

                        ))}

                    </select>

                    &nbsp;

                    <input
                        type="text"
                        placeholder="Issue"
                        value={formData.issue}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                issue: e.target.value,
                            })
                        }
                        required
                    />

                    &nbsp;

                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value,
                            })
                        }
                    >

                        <option value="Open">
                            Open
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                    </select>

                    &nbsp;

                    <select
                        value={formData.assigned_technician}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                assigned_technician: e.target.value,
                            })
                        }
                        required
                    >

                        <option value="" disabled>
                            Select Technician
                        </option>

                        {users.map((user) => (

                            <option
                                key={user.id}
                                value={user.id}
                            >
                                {user.username}
                            </option>

                        ))}

                    </select>

                    &nbsp;

                    <button
                        className="add-btn"
                        type="submit"
                    >
                        {editId
                            ? "Update Ticket"
                            : "Create Ticket"}
                    </button>

                </form>

                <br />

                <table className="asset-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Asset</th>

                            <th>Issue</th>

                            <th>Technician</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            tickets.length === 0 ? (

                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No Tickets Found
                                    </td>
                                </tr>

                            ) : (

                                tickets.map((ticket) => (

                                    <tr key={ticket.id}>

                                        <td>{ticket.id}</td>

                                        <td>{ticket.asset_name}</td>

                                        <td>{ticket.issue}</td>

                                        <td>{ticket.technician_name}</td>

                                        <td>

                                            <span
                                                className={
                                                    ticket.status === "Open"
                                                        ? "badge open"
                                                        : ticket.status === "In Progress"
                                                        ? "badge progress"
                                                        : "badge completed"
                                                }
                                            >
                                                {ticket.status}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                onClick={() => handleEdit(ticket)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(ticket.id)}
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

export default Tickets;