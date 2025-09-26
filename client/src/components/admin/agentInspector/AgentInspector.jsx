import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

function AgentInspector() {
    useEffect(() => {

    }, []);

    return (
        <>
        <Container>
            <Row className="my-2">
                <Col className="p-0">
                    <input
                        placeholder="Search"
                    />
                </Col>
            </Row>
            <Row>
                <h6 className="p-0 my-2">Agents</h6>
            </Row>
        </Container>
        </>
    );
}

export default AgentInspector;