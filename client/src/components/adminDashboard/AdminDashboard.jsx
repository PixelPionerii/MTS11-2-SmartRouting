import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AddEditAgent from "../admin/addEditAgent/AddEditAgent";
import AgentInspector from "../admin/agentInspector/AgentInspector";
import ConfigureRouting from "../admin/configureRouting/ConfigureRouting";
import Interactions from "../admin/interactions/Interactions";
import { useNavigate } from "react-router";
import { axiosInstance, getToken } from "../../api/axiosInstance";

function AdminDashboard() {
    const [status, setStatus] = useState('....');
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
        setStatus('....')
        try {
            const response = await axiosInstance.put(
                "/api/admin/setAvailability",
                { availability: !(status == 'online') },
                {
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                }
            );
            console.log(response.data.status)
            setStatus(response.data.status == true ? 'online' : 'offline')
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
                setStatus(response.data.status ? 'online' : 'offline')
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
                <div className="nav">
                    <h5 className="nav-title">Admin Dashboard</h5>
                    <div className="nav-options">
                        <h6 className="nav-user-name">Hello {JSON.parse(localStorage.getItem('creds'))?.name}</h6>
                        <Button
                            variant={activeView === 'interactions' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('interactions')}
                        >
                            Interactions
                        </Button>
                        <Button
                            variant={activeView === 'agents' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('agents')}
                        >
                            Active agents
                        </Button>
                        <Button
                            variant={activeView === 'addEdit' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('addEdit')}
                        >
                            Add/Edit agent
                        </Button>
                        <Button
                            variant={activeView === 'routing' ? 'primary' : 'outline-primary'}
                            onClick={() => setActiveView('routing')}
                        >
                            Configure Routing
                        </Button>
                        <button
                            className={`status-button  status-button-${status}`}
                            onClick={handleStatusClick}
                        >
                            {status}
                        </button>
                        <Button onClick={() => { localStorage.removeItem('creds'); navigate('/') }}>
                            Logout
                        </Button>
                    </div>
                </div>
                <Row>
                    {renderAdminComponent()}
                </Row>
            </Container>
        </>
    );
}

export default AdminDashboard;