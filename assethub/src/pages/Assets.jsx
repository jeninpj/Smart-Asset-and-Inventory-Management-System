import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Assets() {

    const [assets, setAssets] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        asset_type: "",
        serial_number: "",
        status: "Available",
        purchase_date: "",
    });

    const [editId, setEditId] = useState(null);

    const [search, setSearch] = useState("");

    useEffect(() => {
        document.title = "Assets | AssetHub";
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await api.get("api/assets/");
            setAssets(response.data.results);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.name.trim() ||
            !formData.asset_type.trim() ||
            !formData.serial_number.trim() ||
            !formData.purchase_date
        ) {
            alert("Please fill all fields.");
            return;
        }

        const today = new Date().toISOString().split("T")[0];

        if (formData.purchase_date > today) {
            alert("Purchase date cannot be in the future.");
            return;
        }

        try {

            if (editId) {

                await api.put(
                    `api/assets/${editId}/`,
                    formData
                );

            } else {

                await api.post(
                    "api/assets/",
                    formData
                );

            }

            fetchAssets();

            setFormData({
                name: "",
                asset_type: "",
                serial_number: "",
                status: "Available",
                purchase_date: "",
            });

            setEditId(null);

        } catch (error) {

            console.log(error);

        }
    };

    const handleEdit = (asset) => {

        setFormData({
            name: asset.name,
            asset_type: asset.asset_type,
            serial_number: asset.serial_number,
            status: asset.status,
            purchase_date: asset.purchase_date,
        });

        setEditId(asset.id);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this asset?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`api/assets/${id}/`);

            fetchAssets();

        } catch (error) {

            console.log(error);

        }

    };

    const filteredAssets = assets.filter((asset) =>
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.asset_type.toLowerCase().includes(search.toLowerCase()) ||
        asset.serial_number.toLowerCase().includes(search.toLowerCase()) ||
        asset.status.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div>

            <Sidebar />

            <Navbar />

            <div className="main-content">

                <h2>Assets</h2>

                <br />

                <form onSubmit={handleSubmit} autoComplete="off">

                    <input
                        type="text"
                        placeholder="Asset Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }
                        required
                    />

                    &nbsp;

                    <input
                        type="text"
                        placeholder="Asset Type"
                        value={formData.asset_type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                asset_type: e.target.value,
                            })
                        }
                        required
                    />

                    &nbsp;

                    <input
                        type="text"
                        placeholder="Serial Number"
                        value={formData.serial_number}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                serial_number: e.target.value,
                            })
                        }
                        required
                    />

                    &nbsp;

                    <input
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                purchase_date: e.target.value,
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
                        <option value="Available">Available</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Repair">Repair</option>
                    </select>

                    &nbsp;

                    <button
                        className="add-btn"
                        type="submit"
                    >
                        {editId ? "Update Asset" : "Add Asset"}
                    </button>

                </form>

                <br />
                <br />

                <input
                    type="text"
                    placeholder="Search Asset..."
                    className="search-box"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <br />
                <br />

                <table className="asset-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Asset Type</th>

                            <th>Serial Number</th>

                            <th>Status</th>

                            <th>Purchase Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredAssets.length === 0 ? (

                                <tr>
                                    <td colSpan="7" className="no-data">
                                        No Assets Found
                                    </td>
                                </tr>

                            ) : (

                                filteredAssets.map((asset) => (

                                    <tr key={asset.id}>

                                        <td>{asset.id}</td>

                                        <td>{asset.name}</td>

                                        <td>{asset.asset_type}</td>

                                        <td>{asset.serial_number}</td>

                                        <td>
                                            <span
                                                className={
                                                    asset.status === "Available"
                                                        ? "badge available"
                                                        : asset.status === "Assigned"
                                                        ? "badge assigned"
                                                        : "badge repair"
                                                }
                                            >
                                                {asset.status}
                                            </span>
                                        </td>

                                        <td>{asset.purchase_date}</td>

                                        <td>

                                            <button
                                                onClick={() => handleEdit(asset)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(asset.id)}
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

export default Assets;