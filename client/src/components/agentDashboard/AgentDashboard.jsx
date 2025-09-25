import React, { useState } from "react";
import Requests from "../requests/Requests";
import { Button } from "react-bootstrap";

function AgentDashboard({ requests }) {
    const [status, setStatus] = useState("Offline");

    function handleStatusClick() {
        if (status === "Online") setStatus("Offline");
        else setStatus("Online");
    }

    function handleInteractionsClick() {

    }

    return (
        <>
        <div>
            <div className="d-flex justify-content-end my-2">
                <Button
                    className="mx-1"
                    onClick={handleStatusClick}
                >
                    {status}
                </Button>
                <Button
                    className="ml-1"
                    onClick={handleInteractionsClick}
                >
                    Interactions
                </Button>
            </div>
            <div>
                <Requests requests={requests} />
            </div>
        </div>
        </>
    );
}

export default AgentDashboard;