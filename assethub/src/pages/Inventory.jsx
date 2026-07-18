import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Inventory() {

    const [items, setItems] = useState([]);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        item_type: "",
        quantity: "",
        threshold: "",
    });

    const [editId, setEditId] =useState(null);

    useEffect(() => {
        document.title = "Inventory | AssetHub";
        fetchInventory();
    }, []);

    const fetchInventory = async () => {

        try {

            const response = await api.get("api/inventory/");
            setItems(response.data.results);

        } catch (error) {

            console.log(error);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.item_type.trim() ||
            formData.quantity === "" ||
            formData.threshold === ""
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (formData.quantity < 0 || formData.threshold < 0) {
            alert("Quantity and Threshold cannot be negative.");
            return;
        }

        try {

            if (editId) {

                await api.put(
                    `api/inventory/${editId}/`,
                    formData
                );

            } else {

                await api.post(
                    "api/inventory/",
                    formData
                );

            }

            fetchInventory();

            setFormData({
                item_type: "",
                quantity: "",
                threshold: "",
            });

            setEditId(null);

        } catch (error) {

            console.log(error);

        }

    };

    const handleEdit = (item) => {

        setFormData({
            item_type: item.item_type,
            quantity: item.quantity,
            threshold: item.threshold,
        });

        setEditId(item.id);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this item?"))
            return;

        try {

            await api.delete(
                `api/inventory/${id}/`
            );

            fetchInventory();

        } catch (error) {

            console.log(error);

        }

    };

    const filteredItems = items.filter((item) =>
        item.item_type.toLowerCase().includes(search.toLowerCase()) ||
        item.quantity.toString().includes(search) ||
        item.threshold.toString().includes(search)
    );

    return (

        <div>

            <Sidebar />

            <Navbar />

            <div className="main-content">

                <h2>Inventory</h2>

                <br />

                <form onSubmit={handleSubmit} autoComplete="off">

                    <input
                        type="text"
                        placeholder="Item Type"
                        value={formData.item_type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                item_type: e.target.value,
                            })
                        }
                        required
                    />

                    &nbsp;

                    <input
                        type="number"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                quantity: e.target.value,
                            })
                        }
                        required
                    />

                    &nbsp;

                    <input
                        type="number"
                        placeholder="Threshold"
                        value={formData.threshold}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                threshold: e.target.value,
                            })
                        }
                        required
                    />

                    &nbsp;

                    <button
                        className="add-btn"
                        type="submit"
                    >
                        {editId ? "Update Item" : "Add Item"}
                    </button>

                </form>

                <br />

                <input
                    type="text"
                    placeholder="Search Inventory..."
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

                            <th>Item Type</th>

                            <th>Quantity</th>

                            <th>Threshold</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredItems.length === 0 ? (

                                <tr>
                                    <td colSpan="5" className="no-data">
                                        No Inventory Items Found
                                    </td>
                                </tr>

                            ) : (

                                filteredItems.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.id}</td>

                                        <td>{item.item_type}</td>

                                        <td>{item.quantity}</td>

                                        <td>{item.threshold}</td>

                                        <td>

                                            <button
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id)}
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

export default Inventory;