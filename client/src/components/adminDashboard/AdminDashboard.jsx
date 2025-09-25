import React from "react";
import Requests from "../requests/Requests";

function AdminDashboard({ requests }) {
    return (
        <>
        <Requests requests={requests} />
        </>
    );
}

export default AdminDashboard;