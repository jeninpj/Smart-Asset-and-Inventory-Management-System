import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import api from "../services/api";

function Dashboard() {

    const [dashboard, setDashboard] = useState({

        total_assets: 0,
        available_assets: 0,
        assigned_assets: 0,
        repair_assets: 0,
        recent_assets: [],

    });

    useEffect(() => {
        document.title = "Dashboard | AssetHub";
        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await api.get("api/dashboard/");

            setDashboard(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div>

            <Sidebar />

            <Navbar />

            <div className="main-content">

                <h2>Dashboard</h2>

                <div className="card-container">

                    <div className="card">

                        <h3>Total Assets</h3>

                        <p>{dashboard.total_assets}</p>

                    </div>

                    <div className="card">

                        <h3>Available</h3>

                        <p>{dashboard.available_assets}</p>

                    </div>

                    <div className="card">

                        <h3>Assigned</h3>

                        <p>{dashboard.assigned_assets}</p>

                    </div>

                    <div className="card">

                        <h3>Repair</h3>

                        <p>{dashboard.repair_assets}</p>

                    </div>

                    <div className="card">

                        <h3>Total Tickets</h3>

                        <p>{dashboard.total_repairs}</p>

                    </div>

                </div>

                <h2 style={{ marginTop: "40px" }}>

                    Recent Assets

                </h2>

                <table className="asset-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Type</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            dashboard.recent_assets.length === 0 ? (

                                <tr>
                                    <td colSpan="4" className="no-data">
                                        No Recent Assets
                                    </td>
                                </tr>

                            ) : (

                                dashboard.recent_assets.map((asset) => (

                                    <tr key={asset.id}>

                                        <td>{asset.id}</td>

                                        <td>{asset.name}</td>

                                        <td>{asset.asset_type}</td>

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

export default Dashboard;