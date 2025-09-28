import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";

import "./ConfigureRouting.css";
import { axiosInstance, getToken } from "../../../api/axiosInstance";

function ConfigureRouting() {
    const [requestTypePromptDescription, setRequestTypePromptDescription] = useState('');
    const [agentRouterPromptDescription, setAgentRouterPromptDescription] = useState('');
    const [apiResponse, setApiResponse] = useState('');
    const [updateApiError, setUpdateApiError] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/admin/getPrompts",
                    {
                        headers: {
                            'Authorization': `Bearer ${getToken()}`
                        }
                    }
                );
                const prompts = response.data.prompts;

                if (Array.isArray(prompts) && prompts.length == 2) {
                    const requestTypePrompt = prompts.find(p => p.promptId === "request_type");
                    const agentMappingPrompt = prompts.find(p => p.promptId === "agent_mapping");
                    
                    if (requestTypePrompt) setRequestTypePromptDescription(requestTypePrompt.prompt);
                    if (agentMappingPrompt) setAgentRouterPromptDescription(agentMappingPrompt.prompt);
                    setError(null);
                } else {
                    setError("Invalid response from server");
                }
            } catch (err) {
                console.error(err?.response?.data?.error);
                setError(err?.response?.data?.error);
            }
        })();
    }, []);

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

    async function handleClick(type) {
        let data = {};
        switch (type) {
            case "update-request":
                data = {
                    promptId: "request_type",
                    prompt: requestTypePromptDescription,
                };
                break;
            case "update-routing":
                data = {
                    promptId: "agent_mapping",
                    prompt: agentRouterPromptDescription,
                };
                break;
            default:
                return;
        }
        
        try {

            const response = await axiosInstance.put(
                "api/admin/updatePrompt",
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                }
            );
            setApiResponse(response.data.message);
            setUpdateApiError('');
        } catch (err) {
            console.error(err);
            setUpdateApiError(err?.response?.data?.error);
            setApiResponse('');
        }
    }

    if (error) return <p>Something unexpect happened...</p>;

    return (
        <>
        <Container>
            <Row className="mt-2">
                <div className="p-0 fw-bold">Issue Identification</div>
                <textarea
                    className="my-2 p-2"
                    id="request-type-prompt"
                    onChange={handleChange}
                    value={requestTypePromptDescription}
                />
                <div className="mt-2 p-0">
                    <Button
                        className="me-3"
                        onClick={() => handleClick("update-request")}
                        >
                        Update Request Prompt
                    </Button>
                    {apiResponse && apiResponse.includes("request_type") && <span style={{ color: 'limegreen' }}>{apiResponse}</span>}
                    {updateApiError && <span className="test-danger">{updateApiError}</span>}
                </div>
            </Row>
            <Row className="mt-2">
                <div className="p-0 fw-bold">Agent Mapping</div>
                <textarea
                    className="my-2 p-2"
                    id="agent-router-prompt"
                    onChange={handleChange}
                    value={agentRouterPromptDescription}
                />
                <div className="mt-2 p-0">
                    <Button
                        className="me-3"
                        onClick={() => handleClick("update-routing")}
                        >
                        Update Routing Prompt
                    </Button>
                    {apiResponse && apiResponse.includes("agent_mapping") && <span style={{ color: 'limegreen' }}>{apiResponse}</span>}
                    {updateApiError && <span className="test-danger">{updateApiError}</span>}
                </div>
            </Row>
        </Container>
        </>
    );
}

export default ConfigureRouting;