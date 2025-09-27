import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AddEditAgent from "../admin/addEditAgent/AddEditAgent";
import AgentInspector from "../admin/agentInspector/AgentInspector";
import ConfigureRouting from "../admin/configureRouting/ConfigureRouting";
import Interactions from "../admin/interactions/Interactions";
import { useNavigate } from "react-router";
import { axiosInstance, getToken } from "../../api/axiosInstance";

function AdminDashboard() {
    const [status, setStatus] = useState(false);
    const [activeView, setActiveView] = useState('interactions');
    const navigate = useNavigate()

    function renderAdminComponent() {
        switch (activeView) {
            case 'routing':
                return <ConfigureRouting />;
            case 'agents':
                return <AgentInspector />;
            case 'interactions':
                return <Interactions />;
            case 'addEdit':
                return <AddEditAgent />;
            default:
                return <Interactions />;
        }
    }

    async function handleStatusClick() {
        try {
            const response = await axiosInstance.put(
                "/api/admin/setAvailability",
                { availability: !status },
                {
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                }
            );
            console.log(response.data)
            setStatus(response.data.status)
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                navigate('/login')
                console.log(error.status)
            }
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/admin/getAvailability",
                    {
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        }
                    }
                );
                console.log(response.data)
                setStatus(response.data.status)
            } catch (error) {
                if (error.status === 401 || error.status === 403) {
                    navigate('/login')
                    console.log(error.status)
                }
            }
        })();
    }, [])

    return (
        <>
            <Container>
                <Row>
                    <Col className="d-flex justify-content-between p-0 my-3">
                        <div>{JSON.parse(localStorage.getItem('creds'))?.name}</div>
                        <Button
                            className="mx-1"
                            onClick={handleStatusClick}
                        >
                            {status ? 'Online' : 'Offline'}
                        </Button>
                        <Button onClick={() => { localStorage.removeItem('creds'); navigate('/') }}>
                            Logout
                        </Button>
                        <Button
                            variant={activeView === 'routing' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('routing')}
                        >
                            Configure Routing
                        </Button>
                        <Button
                            variant={activeView === 'agents' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('agents')}
                        >
                            Active agents
                        </Button>
                        <Button
                            variant={activeView === 'interactions' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('interactions')}
                        >
                            Interactions
                        </Button>
                        <Button
                            variant={activeView === 'addEdit' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('addEdit')}
                        >
                            Add/Edit agent
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {renderAdminComponent()}
                </Row>
            </Container>
        </>
    );
}

export default AdminDashboard;