import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Inventory from "./pages/Inventory";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Assignments from "./pages/Assignments";
import Chat from "./pages/Chat";



function App() {

  return (

    <BrowserRouter>

    <Routes>

        <Route
            path="/"
            element={<Login />}
        />

        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/assets"
            element={
                <ProtectedRoute>
                    <Assets />
                </ProtectedRoute>
            }
        />

        <Route
            path="/inventory"
            element={
                <ProtectedRoute>
                    <Inventory />
                </ProtectedRoute>
            }
        />

        <Route
            path="/tickets"
            element={
                <ProtectedRoute>
                    <Tickets />
                </ProtectedRoute>
            }
        />

        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            }
        />

        <Route
            path="/assignments"
            element={
                <ProtectedRoute>
                    <Assignments />
                </ProtectedRoute>
            }
        />

        <Route
            path="/chat"
            element={
                <ProtectedRoute>
                    <Chat />
                </ProtectedRoute>
            }
        />

    </Routes>

</BrowserRouter>

  );

}

export default App;