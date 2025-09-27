import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import Login from "../../components/login/Login";
import { axiosInstance } from "../../api/axiosInstance";
import './UserLogin.css'

function UserLogin() {
    const loginRef = useRef(null);
    const navigate = useNavigate();
    const [formError, setFormError] = useState("");
    const [loading,setLoading] = useState(false)

    async function handleClick(event) {
        setLoading(true)
        event.preventDefault();
        setFormError("");

        if (!loginRef.current.isFormCorrect()) {
            setFormError("Form has errors");
            return;
        }

        try {
            const data = loginRef.current.getLoginFormData();
            
            const response = await axiosInstance.post(
                "/api/auth/customer/login",
                data,
            );
            if (response.status === 200) {
                const data = response.data;

                localStorage.setItem("creds", JSON.stringify(data));
                navigate("/");
            } else {
                setFormError("Error logging in");
            }
        } catch (error) {
            setFormError(error.response.data.error);
        }
        setLoading(false)
    }

    return (
        <>
            <div className="user-login">
                <div className="user-login-left"></div>
                <form className="user-login-right">
                    <div className="user-login-header">
                        <h5>Customer Login</h5>
                        <Link to='/agentadminlogin'>Agent login</Link>
                    </div>
                    <Login ref={loginRef} />
                    <div className="user-login-footer">
                        <Button
                            className="login-button"
                            onClick={handleClick}
                            variant="primary"
                            type="submit"
                            disabled={loading==true}
                        >
                            {loading ? 'Loading..' : 'Login'}
                        </Button>
                        {formError && <span className="small text-danger mt-2">{formError}</span>}
                        <Link to='/signup'>Create account</Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default UserLogin;