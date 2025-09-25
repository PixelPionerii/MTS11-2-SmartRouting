import React from "react";
import { Routes, Route } from "react-router-dom";
import AgentAdminLogin from "./pages/agentAdminLogin/AgentAdminLogin";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Home";
import SignUp from "./pages/signup/SignUp";
import UserLogin from "./pages/userLogin/UserLogin";

const App = () => {
    return (
        <>
        <Routes>
            <Route index element={<Home />} />
            <Route path="/adminlogin" element={<AgentAdminLogin />} />
            <Route path="/dashboard" element={<Dashboard isAdmin={false} />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
        </>
    );
}

export default App;