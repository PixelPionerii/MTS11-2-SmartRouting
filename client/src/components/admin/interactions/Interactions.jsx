import React from "react";
import Requests from "../../requests/Requests";

function Interactions({ requests }) {
    return (
        <>
        <Requests requests={requests} />
        </>
    );
}

export default Interactions;