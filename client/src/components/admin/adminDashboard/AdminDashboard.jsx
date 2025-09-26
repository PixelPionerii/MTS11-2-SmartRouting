import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AddEditAgent from "../addEditAgent/AddEditAgent";
import AgentInspector from "../agentInspector/AgentInspector";
import ConfigureRouting from "../configureRouting/ConfigureRouting";
import Interactions from "../interactions/Interactions";

import { mockRequests } from "../../customerDashboard/CustomerDashboard";

function AdminDashboard() {
    const [activeView, setActiveView] = useState('interactions');

    function renderAdminComponent() {
        switch (activeView) {
            case 'routing':
                return <ConfigureRouting />;
            case 'agents':
                return <AgentInspector />;
            case 'interactions':
                return <Interactions requests={mockRequests} />;
            case 'addEdit':
                return <AddEditAgent />;
            default:
                return <Interactions requests={mockRequests} />;
        }
    }

    return (
        <>
        <Container>
            <Row>
                <Col className="d-flex justify-content-between p-0 my-3">
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