import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { axiosInstance, getToken } from "../../../api/axiosInstance";

import "./AgentInspector.css";

function Agent({ agent }) {
    const [expanded, setExpanded] = useState(false);

    const {
        availability,
        currentWorkload,
        email,
        id,
        issueResolvedCount,
        languagesKnown,
        name,
        phoneNo,
        skills,
        totalRating,
    } = agent || {};

    const languages = Array.isArray(languagesKnown) ? languagesKnown.join(', ') : languagesKnown;
    const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;

    return (
        <>
        <Row>
            <div className="agent-wrapper d-flex flex-column justify-content-center my-2 py-2">
                <div className="agent-overview">
                    <span
                        className="availability"
                        style={{ backgroundColor: availability ? "limegreen" : "red" }}
                    />
                    <div>
                        {name}
                    </div>
                    <div>
                        Workload: {availability ? currentWorkload : 0}
                    </div>
                    <div>
                        Rating: {totalRating}
                    </div>
                    <button 
                        className="details"
                        onClick={() => setExpanded(prev => !prev)}
                    >
                        Details
                    </button>
                </div>
                {expanded && <div>
                    <div>Email: {email}</div>
                    <div>Phone: {phoneNo}</div>
                    <div>Issues Resolved: {issueResolvedCount}</div>
                    <div>Skills: {skillsList}</div>
                    <div>Languages: {languages}</div>
                </div>}
            </div>
        </Row>
        </>
    )
}

function AgentInspector() {
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState("active");

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/admin/getAgents",
                    {
                        headers: {
                            "Authorization": `Bearer ${getToken()}`
                        }
                    }
                );
                console.log(response.data)
                setAgents(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(err);
                setLoading(false);
            }
        })();
    }, []);

    function handleChange(value) {
        setSearch(value)
    }

    function handleStatusFilterChange(value) {
        setStatusFilter(value);
    }
    
    const filteredAgents = useMemo(() => {
        const query = search.trim().toLowerCase();

        let list = [...agents].filter(a => typeof a === 'object');

        if (statusFilter === "active") {
            list = list.filter(a => Boolean(a.availability) === true);
        } else if (statusFilter === "inactive") {
            list = list.filter(a => Boolean(a.availability) === false);
        }

        if (query) {
            list = list.filter(a => {
                const name = (a.nam ?? '').toString().toLowerCase();
                const email = (a.email ?? '').split('@')[0].toString().toLowerCase();                
                return name.includes(query) || email.includes(query);
            });
        }
        
        list.sort((a, b) => {
            if (a.availability !== b.availability)
                return a.availability ? -1 : 1;
            return 0;
        });

        return list;
    }, [agents, search, statusFilter]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error retrieving agents</p>;

    return (
        <>
        <Container>
            <Row className="my-2">
                <Col className="p-0">
                    <input
                        placeholder="Search"
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </Col>
                <Col className="p-0">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </Col>
            </Row>
            <Row>
                <h6 className="p-0 my-2">Agents</h6>
                {filteredAgents.map(agent => <Agent key={agent.id} agent={agent} />)}
            </Row>
        </Container>
        </>
    );
}

export default AgentInspector;