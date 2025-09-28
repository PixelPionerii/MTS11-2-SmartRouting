import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { axiosInstance, getToken } from "../../api/axiosInstance";

import "./Requests.css";
import { useNavigate } from "react-router";

function Request({ request, role }) {
    const navigate = useNavigate();
    if (typeof request !== "object") return;
    const [showRatingDialog, setShowRatingDialog] = useState(false)
    const [closeRequestLoading, setCloseRequestLoading] = useState(false)
    const [rating, setRating] = useState(0)

    async function closeRequest() {
        setCloseRequestLoading(true)
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
        setCloseRequestLoading(false)
    }

    function showDetails(id) {
        const request = document.getElementById(`request-${id}`)
        const requestBody = request.querySelector('.request-card-body')
        if (requestBody.classList.contains('request-card-body-open')) {
            requestBody.classList.remove('request-card-body-open')
        }
        else {
            requestBody.classList.add('request-card-body-open')
        }
    }

    return (
        <div key={request.id} id={`request-${request.id}`}>
            <div className="request-card">
                <div className="request-card-header">
                    <div><strong>Id:</strong> {request.id}</div>
                    <div><strong>Customer name:</strong> {request.customer.name}</div>
                    <div><strong>Assigned agent:</strong> {request.agent.name}</div>
                    <div className="request-card-header-opts">
                        {request.status === "OPEN" && <Button onClick={() => setShowRatingDialog(true)}>close</Button>}
                        <Button onClick={() => { showDetails(request.id) }}>details</Button>
                    </div>
                </div>
                <div className="request-card-body">
                    <strong>Description: </strong><div>{request.description}</div>
                    <strong>Mapping reason: </strong><div>{request.mappingReason}</div>
                    <strong>Priority: </strong><div>{request.priority}</div>
                    <strong>Request type: </strong><div>{request.type}</div>
                    <strong>&nbsp;</strong><div></div>
                    <strong>Agent name: </strong><div>{request.agent.name}</div>
                    <strong>Agent availability: </strong><div>{request.agent.availability ? 'Online' : 'Offline'}</div>
                    <strong>Agent email: </strong><div>{request.agent.email}</div>
                    <strong>Agent phone no: </strong><div>{request.agent.phoneNo}</div>
                    <strong>Agent known languages: </strong><div>{request.agent.languagesKnown.join(',')}</div>
                    <strong>&nbsp;</strong><div></div>
                    <strong>Customer name: </strong><div>{request.customer.name}</div>
                    <strong>Customer email: </strong><div>{request.customer.email}</div>
                    <strong>Customer phone no: </strong><div>{request.customer.phoneNo}</div>
                    <strong>Customer language: </strong><div>{request.customer.language}</div>
                </div>
            </div>
            {
                showRatingDialog &&
                <div className="rating-dialog-backbrop">
                    <div className="rating-dialog">
                        <div className="rating-dialog-head">
                            {
                                role == 'customer' &&
                                <>
                                    <label htmlFor="rating-1" className={`rating-star ${rating >= 1 && 'rating-start-on'}`}></label>
                                    <input type="radio" name="rating" id="rating-1" value='1' onClick={() => setRating(1)} defaultChecked={rating === 1} />
                                    <label htmlFor="rating-2" className={`rating-star ${rating >= 2 && 'rating-start-on'}`}></label>
                                    <input type="radio" name="rating" id="rating-2" value='2' onClick={() => setRating(2)} defaultChecked={rating === 2} />
                                    <label htmlFor="rating-3" className={`rating-star ${rating >= 3 && 'rating-start-on'}`}></label>
                                    <input type="radio" name="rating" id="rating-3" value='3' onClick={() => setRating(3)} defaultChecked={rating === 3} />
                                    <label htmlFor="rating-4" className={`rating-star ${rating >= 4 && 'rating-start-on'}`}></label>
                                    <input type="radio" name="rating" id="rating-4" value='4' onClick={() => setRating(4)} defaultChecked={rating === 4} />
                                    <label htmlFor="rating-5" className={`rating-star ${rating >= 5 && 'rating-start-on'}`}></label>
                                    <input type="radio" name="rating" id="rating-5" value='5' onClick={() => setRating(5)} defaultChecked={rating === 5} />
                                </>
                            }
                        </div>
                        <div className="rating-dialog-body">
                            <Button disabled={closeRequestLoading} onClick={closeRequest}>{closeRequestLoading ? 'Loading...' : 'Close Request'}</Button>
                        </div>
                        <div className="rating-dialog-close" onClick={() => { setShowRatingDialog(false); setRating(0) }}></div>
                    </div>
                </div>
            }

        </div>
    );
}

function RequestSection({ requests, sectionStatus, sectionTitle, role }) {
    return (
        <div className="request-section">
            <h6>{sectionTitle}</h6>
            <div className="request-section-inner">
                {requests.map(request =>
                    <Request key={request.id} request={request} role={role} />
                )}
            </div>
        </div>
    );
}

function Requests({ requests, role }) {
    return (
        <div className="request-sections">
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
        </div>
    );
}

export default Requests;