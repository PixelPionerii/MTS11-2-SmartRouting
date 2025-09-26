import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Requests from "../../components/requests/Requests";
import { axiosInstance, getToken } from "../../api/axiosInstance";

import "./CustomerDashboard.css";
import { useNavigate } from "react-router";

const CustomerDashboard = () => {
    const [query, setQuery] = useState("");
    const [priority, setPriority] = useState("");
    const [requestData,setRequestData] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/customer/request",
                    {
                        headers:{
                            'Authorization': 'Bearer ' + getToken()
                        }
                    }
                );
                console.log(response.data)
                setRequestData(response.data)
            } catch (error) {
                if(error.status === 401 || error.status === 403){
                    navigate('/login')
                    console.log(error.status)
                }
            }
        })();
        
    },[])

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
 
    return (
        <>
        <Container>
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
                        <option>Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="severe">Severe</option>
                    </select>
                </Col>
                <Col>
                    <Button
                        id="request-button"
                    >
                        Create Requsest
                    </Button>
                </Col>
            </Row>
            <Row>
                {
                    requestData != null 
                    ?
                    <Requests requests={requestData} />
                    :
                    <div>Loading</div>
                }
            </Row>
        </Container>
        </>
    );
}

export default CustomerDashboard;