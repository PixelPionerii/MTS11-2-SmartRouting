import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import Login from "../../components/login/Login";

export default function AgentAdminLogin() {
    const loginRef = useRef(null);

    return (
        <>
        <div className="d-flex flex-column align-items-center">
            <Login ref={loginRef} />
            <Button
                className="mt-2"
                onClick={() => console.log(loginRef.current.getLoginFormData())}
                variant="primary"
            >
                Login
            </Button>
        </div>
        </>
    );
}