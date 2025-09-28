import React, { useEffect, useState } from "react";
import Requests from "../requests/Requests";
import { Button, Container } from "react-bootstrap";
import { axiosInstance, getToken } from "../../api/axiosInstance";
import { useNavigate } from "react-router";
import './AdminDashboard.css'

function AgentDashboard({ requests }) {
    const [status, setStatus] = useState('....');
    const [requestData, setRequestData] = useState(null)
    const navigate = useNavigate()

    async function handleStatusClick() {
        setStatus('....')
        try {
            const response = await axiosInstance.put(
                "/api/agent/setAvailability",
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
                    "/api/agent/request",
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

        (async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/agent/getAvailability",
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
                    <h5 className="nav-title">Agent Dashboard</h5>
                    <div className="nav-options">
                        <h6 className="nav-user-name">Hello {JSON.parse(localStorage.getItem('creds'))?.name}</h6>
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
                <div>
                    {
                        requestData != null
                            ?
                            <Requests requests={requestData} role='agent' />
                            :
                            <div>Loading</div>
                    }
                </div>
            </Container>
        </>
    );
}

export default AgentDashboard;