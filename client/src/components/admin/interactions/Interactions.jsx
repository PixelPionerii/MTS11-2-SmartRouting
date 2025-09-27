import React, { useEffect, useState } from "react";
import Requests from "../../requests/Requests";
import { useNavigate } from "react-router";
import { axiosInstance, getToken } from "../../../api/axiosInstance";
import { Button } from "react-bootstrap";

function Interactions({ requests }) {
    const [requestData, setRequestData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/admin/request",
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

    return (
        <div>
            {
                requestData != null
                    ?
                    <Requests requests={requestData} role='admin' />
                    :
                    <div>Loading</div>
            }
        </div>
    );
}

export default Interactions;