import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import api from "../services/api";

function Profile() {

    const [profile, setProfile] = useState({

        username: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",

    });

    useEffect(() => {
        document.title = "Profile | AssetHub";
        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            const response = await api.get("api/profile/");

            setProfile(response.data);

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

                <h2>My Profile</h2>

                <div className="profile-card">

                    <h3>

                        {profile.first_name} {profile.last_name}

                    </h3>

                    <p>

                        <strong>Username : </strong>

                        {profile.username}

                    </p>

                    <p>

                        <strong>Email : </strong>

                        {profile.email}

                    </p>

                    <p>

                        <strong>Role : </strong>

                        {profile.role}

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Profile;