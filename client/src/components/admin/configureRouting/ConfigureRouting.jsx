import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";

import "./ConfigureRouting.css";

function ConfigureRouting() {
    const [requestTypePromptDescription, setRequestTypePromptDescription] = useState("");
    const [agentRouterPromptDescription, setAgentRouterPromptDescription] = useState("");

    function handleChange(event) {
        const { id, value } = event.target;

        switch (id) {
            case "request-type-prompt":
                setRequestTypePromptDescription(value);
                break;
            case "agent-router-prompt":
                setAgentRouterPromptDescription(value);
                break;
            default:
                return;
        }
    }

    return (
        <>
        <Container>
            <Row className="mt-2">
                <textarea
                    className="p-2"
                    id="request-type-prompt"
                    onChange={handleChange}
                    value={requestTypePromptDescription}
                />
            </Row>
            <Row className="mt-2">
                <textarea
                    className="p-2"
                    id="agent-router-prompt"
                    onChange={handleChange}
                    value={agentRouterPromptDescription}
                />
            </Row>
        </Container>
        </>
    );
}

export default ConfigureRouting;