import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import AdminDashboard from "../../components/admin/adminDashboard/AdminDashboard";
import AgentDashboard from "../../components/agentDashboard/AgentDashboard";
import CustomerDashboard from "../../components/customerDashboard/CustomerDashboard";
import { useNavigate } from "react-router";


function GetDashboard() {
    const navigate = useNavigate();
    const [role, setRole] = useState("")
    
    useEffect(() => {
        let creds = localStorage.getItem("creds");
        creds = JSON.parse(creds);   
        try { 
            if(!creds || !creds.role || !creds.token){
                navigate('/')
            }
    
            setRole(creds.role)
        } catch (error) {
            navigate('/')
        }
    }, []);
    
    if (role === "customer") {
        return <CustomerDashboard />;
    } else if (role === "admin") {
        return <AdminDashboard />;
    } else if (role === "agent") {
        return <AgentDashboard />;
    }
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