import React, { forwardRef, useImperativeHandle, useState } from "react";

function Login(props, ref) {
    const [emailData, setEmailData] = useState({
        value: "",
        error: "",
        state: ""
    });

    const [passwordData, setPasswordData] = useState({
        value: "",
        error: "",
        state: ""
    });

    useImperativeHandle(ref, () => ({
        getLoginFormData: () => ({
            email: emailData.value,
            password: passwordData.value,
        }),
        isFormCorrect: () => emailData.error === "" && passwordData.error === ""
    }));

    function handleChange(event) {
        const { id, value } = event.target;

        switch (id) {
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    setEmailData(prev => ({
                        ...prev,
                        value: value.trim(),
                        error: "Invalid Email"
                    }));
                } else {
                    setEmailData(prev => ({
                        ...prev,
                        value: value.trim(),
                        error: ""
                    }));
                }
                break;

            case "password":
                if (value.length < 8) {
                    setPasswordData(prev => ({
                        ...prev,
                        value: value.trim(),
                        error: "Password must be at least 8 characters long"
                    }));
                } else {
                    setPasswordData(prev => ({
                        ...prev,
                        value: value.trim(),
                        error: ""
                    }));
                }
                break;

            default:
                return;
        }
    }

    return (
        <>
            <div className="login">
                <div className="login-field">
                    <input
                        className="login-input"
                        id="email"
                        type="email"
                        onChange={handleChange}
                        placeholder="Email"
                        value={emailData.value}
                    />
                    {emailData.error && <span className="small text-danger">{emailData.error}</span>}
                </div>
                <div className="login-field">
                    <input
                        className="login-input"
                        id="password"
                        type="password"
                        onChange={handleChange}
                        placeholder="Password"
                        value={passwordData.value}
                    />
                    {passwordData.error && <span className="small text-danger">{passwordData.error}</span>}
                </div>
            </div>
        </>
    );
}

export default forwardRef(Login);