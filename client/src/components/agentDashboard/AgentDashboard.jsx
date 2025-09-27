import React, { useEffect, useState } from "react";
import Requests from "../requests/Requests";
import { Button } from "react-bootstrap";
import { axiosInstance, getToken } from "../../api/axiosInstance";
import { useNavigate } from "react-router";

function AgentDashboard({ requests }) {
    const [status, setStatus] = useState(false);
    const [requestData, setRequestData] = useState(null)
    const navigate = useNavigate()

    async function handleStatusClick() {
        try {
            const response = await axiosInstance.put(
                "/api/agent/setAvailability",
                { availability: !status },
                {
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                }
            );
            console.log(response.data)
            setStatus(response.data.status)
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
                setStatus(response.data.status)
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
            <div>
                <div className="d-flex justify-content-end my-2">
                    <div>{JSON.parse(localStorage.getItem('creds'))?.name}</div>
                    <Button
                        className="mx-1"
                        onClick={handleStatusClick}
                    >
                        {status ? 'Online' : 'Offline'}
                    </Button>
                    <Button onClick={() => { localStorage.removeItem('creds'); navigate('/') }}>
                        Logout
                    </Button>
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
            </div>
        </>
    );
}

export default AgentDashboard;