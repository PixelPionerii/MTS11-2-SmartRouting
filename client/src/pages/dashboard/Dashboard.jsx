import React from "react";
import { Container, Row } from "react-bootstrap";
import AdminDashboard from "../../components/adminDashboard/AdminDashboard";
import AgentDashboard from "../../components/agentDashboard/AgentDashboard";

import { mockRequests } from "../home/Home";

function Dashboard({ isAdmin }) {
    return (
        <>
        <Container>
            <Row>
                {isAdmin ? <AdminDashboard requests={mockRequests} /> : <AgentDashboard requests={mockRequests} />}
            </Row>
        </Container>
        </>
    );
}

export default Dashboard;