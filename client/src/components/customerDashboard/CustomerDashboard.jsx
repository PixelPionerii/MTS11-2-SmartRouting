import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Requests from "../../components/requests/Requests";
import { axiosInstance, getToken } from "../../api/axiosInstance";

import "./CustomerDashboard.css";
import { useNavigate } from "react-router";

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [priority, setPriority] = useState("");
    const [requestData, setRequestData] = useState(null)
    const [requestCreateLoading, setRequestCreateLoading] = useState(false)
    const [requestCreateResponse, setRequestCreateResponse] = useState("Finding an appropriate agent")

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/customer/request",
                    {
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        }
                    }
                );
                console.log(response.data)
                setRequestData(response.data)
            } catch (error) {
                if (error.status === 401 || error.status === 403) {
                    navigate('/login')
                    console.log(error.status)
                }
            }
        })();

    }, [])

    function handleChange(event) {
        const { id, value } = event.target;

        switch (id) {
            case "priority":
                setPriority(value);
                break;
            case "query":
                setQuery(value);
                break
            default:
                return;
        }
    }

    async function createRequest() {
        if (query != "" && priority != "") {
            try {
                setRequestCreateLoading(true)
                const response = await axiosInstance.post(
                    "/api/customer/request/create",
                    {
                        description: query,
                        priority: priority
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        }
                    }
                );
                if (response.status == 201) {
                    setRequestCreateResponse(`you got assigned to the agent ${response.data.assignedAgentName}`)
                }
                else {
                    alert("eror")
                }
            } catch (error) {
                if (error.status === 401 || error.status === 403) {
                    navigate('/')
                }
                else {
                    alert(error.response.data.error)
                    setRequestCreateLoading(false)
                }
            }
        }
    }

    return (
        <>
            <Container>
                <div className="d-flex justify-content-end my-2">
                    <div>{JSON.parse(localStorage.getItem('creds'))?.name}</div>
                    <Button onClick={() => { localStorage.removeItem('creds'); navigate('/') }}>
                        Logout
                    </Button>
                </div>
                <Row>
                    <textarea
                        id="query"
                        onChange={handleChange}
                        placeholder="Query"
                        value={query}
                    />
                </Row>
                <Row>
                    <Col>
                        <select
                            id="priority"
                            onChange={handleChange}
                            value={priority}
                        >
                            <option value="">Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="severe">Severe</option>
                        </select>
                    </Col>
                    <Col>
                        <Button
                            id="request-button"
                            onClick={createRequest}
                        >
                            Create Requsest
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {
                        requestData != null
                            ?
                            <Requests requests={requestData} role='customer' />
                            :
                            <div>Loading</div>
                    }
                </Row>
                {requestCreateLoading &&
                    <div style={{ position: 'absolute', width: '100vw', height: '100vh', background: 'white', left: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        {requestCreateResponse}
                        {
                            requestCreateResponse != "Finding an appropriate agent" &&
                            <Button onClick={() => { window.location.reload() }}>Close</Button>
                        }
                    </div>
                }
            </Container>
        </>
    );
}

export default CustomerDashboard;