import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Requests from "../../components/requests/Requests";

import "./Home.css";

const mockRequests = [
    { title: "Segmentation fault", status: "open", details: "" },
    { title: "Stack overflow", status: "closed", details: "" },
    { title: "Ctrl^c", status: "open", details: "" },
    { title: "Null pointer", status: "open", details: "" },
    { title: "Out of memory", status: "closed", details: "" },
]

const Home = () => {
    const [query, setQuery] = useState("");
    const [priority, setPriority] = useState("");

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
            <Row className="mt-2">
                <textarea
                    className="p-2"
                    id="query"
                    onChange={handleChange}
                    placeholder="Query"
                    value={query}
                />
            </Row>
            <Row className="mt-2 justify-content-between">
                <Col className="p-0">
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
                <Col className="d-flex justify-content-end p-0">
                    <Button
                        id="request-button"
                    >
                        Create Requsest
                    </Button>
                </Col>
            </Row>
            <Row className="mt-2">
                <Requests requests={mockRequests} />
            </Row>
        </Container>
        </>
    );
}

export default Home;