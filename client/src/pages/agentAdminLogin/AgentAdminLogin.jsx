import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import Login from "../../components/login/Login";
import { axiosInstance } from "../../api/axiosInstance";

function AgentAdminLogin() {
    const loginRef = useRef(null);
    const navigate = useNavigate();
    const [formError, setFormError] = useState("");

    async function handleClick(event) {
        event.preventDefault();
        setFormError("");

        if (!loginRef.current.isFormCorrect()) {
            setFormError("Form has errors");
            return;
        }

        try {
            const data = loginRef.current.getLoginFormData();
            const response = await axiosInstance.post(
                "/api/auth/agent/login",
                data,
            );

            if (response.status === 200) {
                const data = response.data;

                localStorage.setItem("creds", JSON.stringify(data));
                navigate("/dashboard");
            } else {
                setFormError("Error logging in");
            }
        } catch (error) {
            setFormError(error.response.data.error);
        }
    }

    return (
        <>
        <div className="d-flex flex-column align-items-center">
            <p className="m-0">Admin Login</p>
            <Link to='/login'>User Login</Link>
            <Login ref={loginRef} />
            {formError && <span className="small text-danger mt-2">{formError}</span>}
            <Button
                className="mt-2"
                onClick={handleClick}
                variant="primary"
            >
                Login
            </Button>
        </div>
        </>
    );
}

export default AgentAdminLogin;