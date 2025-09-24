import React from "react";
import { Button } from "react-bootstrap";

import "./Requests.css";

function Request({ request }) {
    if (typeof request !== "object") return;
    
    return (
        <>
        <div className="d-flex align-items-center justify-content-between request my-2 p-2">
            <p className="m-0">{request.title}</p>
            <div>
                {request.status === "open" && <Button className="mx-1 request-btn">X</Button>}
                <Button className="mx-1 request-btn">!</Button>
            </div>
        </div>
        </>
    );
}

function RequestSection({ requests, sectionStatus, sectionTitle }) {
    return (
        <div className="p-0">
            <h6 className="m-0">{sectionTitle}</h6>
            {requests.map(request => {
                if (request.status === sectionStatus) {
                    return <Request key={request.title} request={request} />
                }
                return null;
            })}
        </div>
    );
}

function Requests({ requests }) {
    if (!requests || !Array.isArray(requests) || requests.length <= 0) return;

    return (
        <>
        <RequestSection
            requests={requests}
            sectionStatus="open"
            sectionTitle="Open Requests"
        />
        <RequestSection
            requests={requests}
            sectionStatus="closed"
            sectionTitle="Closed Requests"
        />
        </>
    );
}

export default Requests;