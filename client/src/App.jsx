import React from "react";
import { Routes, Route } from "react-router-dom";
import AgentAdminLogin from "./pages/agentAdminLogin/AgentAdminLogin";
import Home from "./pages/home/Home";
import SignUp from "./pages/signup/SignUp";

const App = () => {
    return (
        <>
        <Routes>
            <Route index element={<Home />} />
            <Route path="/adminlogin" element={<AgentAdminLogin />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
        </>
    );
}

export default App;