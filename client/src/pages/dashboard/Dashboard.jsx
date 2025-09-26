import React from "react";
import { Container, Row } from "react-bootstrap";
import AdminDashboard from "../../components/admin/adminDashboard/AdminDashboard";
import AgentDashboard from "../../components/agentDashboard/AgentDashboard";
import CustomerDashboard from "../../components/customerDashboard/CustomerDashboard";

import { mockRequests } from "../../components/customerDashboard/CustomerDashboard";

function GetDashboard() {
    let creds = localStorage.getItem("creds");
    creds = JSON.parse(creds);

    if (creds.role === "customer") {
        return <CustomerDashboard />;
    } else if (creds.role === "admin") {
        return <AdminDashboard />;
    } else if (creds.role === "agent") {
        return <AgentDashboard requests={mockRequests} />;
    }

    return <><p>Something unexpected happened...</p></>
}

function Dashboard() {

    return (
        <>
        <Container>
            <Row>
                <GetDashboard />
            </Row>
        </Container>
        </>
    );
}

export default Dashboard;