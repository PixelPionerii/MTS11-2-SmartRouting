import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
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
    const [validationError, setValidationError] = useState("")

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
        else{
            setValidationError("Fill all the fields")
        }
    }

    return (
        <>
            <Container>
                <div className="nav">
                    <h5 className="nav-titile">Customer Dashboard</h5>
                    <div className="nav-options">
                        <h6 className="nav-user-name">Hello {JSON.parse(localStorage.getItem('creds'))?.name}</h6>
                        <Button onClick={() => { localStorage.removeItem('creds'); navigate('/') }}>
                            Logout
                        </Button>
                    </div>
                </div>
                <textarea
                    id="query"
                    onChange={handleChange}
                    placeholder="Query"
                    value={query}
                />

                <div className="query-footer">
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
                    <Button
                        id="request-button"
                        onClick={createRequest}
                    >
                        Create Requsest
                    </Button>
                    {validationError && <span className="small text-danger mt-2">{validationError}</span>}
                </div>

                <div>
                    {
                        requestData != null
                            ?
                            <Requests requests={requestData} role='customer' />
                            :
                            <div>Loading</div>
                    }
                </div>

                {requestCreateLoading &&
                    <div className="request-create-loading">
                        {requestCreateResponse}
                        {
                            requestCreateResponse != "Finding an appropriate agent" ?
                            <Button className="request-create-close" onClick={() => { window.location.reload() }}>Close</Button>
                            :
                            <Spinner></Spinner>
                        }
                    </div>
                }
            </Container>
        </>
    );
}

export default CustomerDashboard;