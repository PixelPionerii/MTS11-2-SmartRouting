import React, { forwardRef, useImperativeHandle, useState } from "react";

function Login(props, ref) {
    const [loginData, setLoginData] = useState({
        formData: {
            email: "",
            password: "",
        },
        errorData: {
            email: "",
            password: "",
        },
        state: {
            email: "",
            password: "",
        }
    });
    const [errorData, setErrorData] = useState({
    })

    useImperativeHandle(ref, () => ({
        getLoginFormData: () => loginData
    }));

    function handleChange(event) {
        const { id, value } = event.target;

        switch (id) {
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    setErrorData(prev => ({ ...prev, emailError: "Invalid Email" }));
                } else {
                    setErrorData(prev => ({ ...prev, emailError: "" }));
                }
                setLoginData(prev => ({ ...prev, email: value.trim() }));
                break;
            case "password":
                if (value.length < 8) {
                    setErrorData(prev => ({ ...prev, passwordError: "Password must be at lease 8 characters long" }));
                } else {
                    setErrorData(prev => ({ ...prev, passwordError: "" }));
                }
                setLoginData(prev => ({ ...prev, password: value.trim() }));
                break;
            default:
                return;
        }
    }

    return (
        <>
        <form>
            <div className="d-flex flex-column align-items-center">
                <label id="label-login"></label>
                <input
                    className="mt-2"
                    id="email"
                    onChange={handleChange}
                    placeholder="Email"
                    value={loginData.email}
                />
                {errorData.emailError && <span className="small text-danger">{errorData.emailError}</span>}
                <input
                    className="mt-2"
                    id="password"
                    onChange={handleChange}
                    placeholder="Password"
                    value={loginData.password}
                />
                {errorData.passwordError && <span className="small text-danger">{errorData.passwordError}</span>}
            </div>
        </form>
        </>
    );
}

export default forwardRef(Login);