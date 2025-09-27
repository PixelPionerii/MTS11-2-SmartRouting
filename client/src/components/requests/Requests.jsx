import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { axiosInstance, getToken } from "../../api/axiosInstance";

import "./Requests.css";
import { useNavigate } from "react-router";

function Request({ request, role }) {
    const navigate = useNavigate();
    if (typeof request !== "object") return;
    const [showRatingDialog, setShowRatingDialog] = useState(false)
    const [rating, setRating] = useState(0)

    async function closeRequest() {
        try {
            if (rating != 0 || role == 'admin' || role == 'agent') {
                console.log(request.id, rating, role)
                const response = await axiosInstance.put(
                    `/api/${role}/request/close`,
                    {
                        requestId: request.id,
                        rating: rating
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        }
                    }
                );
                if (response.status == 200)
                    window.location.reload();
            }
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                navigate('/')
            }
            else {
                alert(error.response.data.error)
            }
        }
    }

    return (
        <div key={request.id}>
            <div className="d-flex align-items-center justify-content-between request my-2 p-2">
                <div>
                    <div>Id: {request.id}</div>
                    <div>Status: {request.status}</div>
                    <div>description: {request.description}</div>
                    <div>mapping reason: {request.mappingReason}</div>
                    <div>priority: {request.priority}</div>
                    <div>request type: {request.type}</div>
                </div>
                <div>
                    {request.status === "OPEN" && <Button onClick={() => setShowRatingDialog(true)}>close</Button>}
                </div>
            </div>
            {
                showRatingDialog &&
                <div>
                    {
                        role == 'customer' &&
                        <>
                            <input type="radio" name="rating" id="rating" value='1' onClick={() => setRating(1)} defaultChecked={rating === 1} />
                            <input type="radio" name="rating" id="rating" value='2' onClick={() => setRating(2)} defaultChecked={rating === 2} />
                            <input type="radio" name="rating" id="rating" value='3' onClick={() => setRating(3)} defaultChecked={rating === 3} />
                            <input type="radio" name="rating" id="rating" value='4' onClick={() => setRating(4)} defaultChecked={rating === 4} />
                            <input type="radio" name="rating" id="rating" value='5' onClick={() => setRating(5)} defaultChecked={rating === 5} />
                        </>
                    }
                    <Button onClick={() => { setShowRatingDialog(false); setRating(0) }}>Close Dialog</Button>
                    <Button onClick={closeRequest}>Close Request</Button>
                </div>
            }

        </div>
    );
}

function RequestSection({ requests, sectionStatus, sectionTitle, role }) {
    return (
        <div>
            <h6>{sectionTitle}</h6>
            {requests.map(request =>
                <Request key={request.id} request={request} role={role} />
            )}
        </div>
    );
}

function Requests({ requests, role }) {
    return (
        <>
            <RequestSection
                requests={requests.openRequests}
                sectionStatus="open"
                sectionTitle="Open Requests"
                role={role}
            />
            <RequestSection
                requests={requests.closedRequests}
                sectionStatus="closed"
                sectionTitle="Closed Requests"
                role={role}
            />
        </>
    );
}

export default Requests;