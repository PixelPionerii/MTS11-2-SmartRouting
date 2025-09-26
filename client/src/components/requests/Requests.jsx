import React from "react";
import { Button } from "react-bootstrap";

import "./Requests.css";

function Request({ request }) {
    if (typeof request !== "object") return;

    return (
        <div key={request.id} className="d-flex align-items-center justify-content-between request my-2 p-2">
            <div>
                <div>description: {request.description}</div>
                <div>priority: {request.priority}</div>
                <div>request type: {request.type}</div>
            </div>
            <div>
                {request.status === "OPEN" && <Button>close</Button>}
            </div>
        </div>
    );
}

function RequestSection({ requests, sectionStatus, sectionTitle }) {
    return (
        <div>
            <h6>{sectionTitle}</h6>
            {requests.map(request => 
                <Request key={request.id} request={request} />
            )}
        </div>
    );
}

function Requests({ requests }) {
    return (
        <>
            <RequestSection
                requests={requests.openRequests}
                sectionStatus="open"
                sectionTitle="Open Requests"
            />
            <RequestSection
                requests={requests.closedRequests}
                sectionStatus="closed"
                sectionTitle="Closed Requests"
            />
        </>
    );
}

export default Requests;