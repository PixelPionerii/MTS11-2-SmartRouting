import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router";

function Input({ changeFn, inputFor, value, error }) {
    const inputId = inputFor.toLowerCase().replace(" ", "-");
    const inputType = inputFor.toLowerCase().includes("password") ? "password" : 
                     inputFor.toLowerCase() === "email" ? "email" : "text";
    
    return (
        <>
        <input
            id={inputId}
            type={inputType}
            className="m-2"
            onChange={changeFn}
            placeholder={inputFor}
            value={value || ""}
        />
        {error && <span className="small text-danger">{error}</span>}
        </>
    );
}

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        tier: "silver",
        language: "en",
        password: "",
        confirmPassword: ""
    });

    const [formErrorData, setFormErrorData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [apiError, setApiError] = useState("");

    function handleChange(event) {
        const { id, value } = event.target;

        setFormErrorData(prev => ({ ...prev, [id]: "" }));

        switch (id) {
            case "name":
                if (value.trim().length < 2) {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        name: "Name must be at least 2 characters long" 
                    }));
                }
                setFormData(prev => ({ ...prev, name: value.trim() }));
                break;
            
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        email: "Invalid Email" 
                    }));
                }
                setFormData(prev => ({ ...prev, email: value.trim() }));
                break;
            
            case "phone":
                const filteredPhoneValue = value.replace(/[^+\d]/g, '');
                
                const phonePattern = /^(\+\d{10,15}|\d{10})$/;
                if (filteredPhoneValue && !phonePattern.test(filteredPhoneValue)) {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        phone: "Enter valid phone number (+1234567890 or 1234567890)" 
                    }));
                }
                setFormData(prev => ({ ...prev, phone: filteredPhoneValue }));
                break;

            case "tier":
            case "language":
                setFormData(prev => ({ ...prev, [id]: value }));
                break;
            
            case "password":
                if (value.length < 8) {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        password: "Password must be at least 8 characters long" 
                    }));
                }
                
                if (formData.confirmPassword && value !== formData.confirmPassword) {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        confirmPassword: "Passwords do not match" 
                    }));
                } else if (formData.confirmPassword && value === formData.confirmPassword) {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        confirmPassword: "" 
                    }));
                }
                setFormData(prev => ({ ...prev, password: value.trim() }));
                break;
            
            case "confirm-password":
                if (value !== formData.password) {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        confirmPassword: "Passwords do not match" 
                    }));
                } else {
                    setFormErrorData(prev => ({ 
                        ...prev, 
                        confirmPassword: "" 
                    }));
                }
                setFormData(prev => ({ ...prev, confirmPassword: value.trim() }));
                break;
            
            default:
                return;
        }
    }
    
    async function handleClick(event) {        
        event.preventDefault();
        setApiError("");
        
        const hasErrors = Object.values(formErrorData).some(error => error !== "");
        if (hasErrors) {
            console.log("Form has errors");
            return;
        }
        
        const hasEmptyFields = Object.values(formData).some(value => value.trim() === "");
        if (hasEmptyFields) {
            console.log("Fill all the fields");
            return;
        }

        try {
            const data = {
                name: formData.name,
                email: formData.email, 
                password: formData.password, 
                language: formData.language, 
                tier: formData.tier, 
                phoneNo: formData.phone
            };
            
            const response = await axiosInstance.post(
                "/api/auth/customer/signup",
                data
            );
    
            if (response.status === 201) {
                navigate("/login");
            } else {
                setApiError("Error Signing up the user")
            }
        } catch (error) {
            setApiError(error.response.data.error);
        }        
    }

    return (
        <>
        <form>
            <div className="d-flex flex-column align-items-center">
                <p>Sign-up</p>
                <Input 
                    inputFor="Name" 
                    changeFn={handleChange}
                    value={formData.name}
                    error={formErrorData.name}
                />
                <Input 
                    inputFor="Email" 
                    changeFn={handleChange}
                    value={formData.email}
                    error={formErrorData.email}
                />
                <Input 
                    inputFor="Phone" 
                    changeFn={handleChange}
                    value={formData.phone}
                    error={formErrorData.phone}
                />
                <select
                    className="m-2"
                    id="tier"
                    onChange={handleChange}
                    value={formData.tier}
                >
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                </select>
                <select
                    className="m-2"
                    id="language"
                    onChange={handleChange}
                    value={formData.language}
                >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="fr">French</option>
                </select>
                <Input 
                    inputFor="Password" 
                    changeFn={handleChange}
                    value={formData.password}
                    error={formErrorData.password}
                />
                <Input 
                    inputFor="Confirm Password" 
                    changeFn={handleChange}
                    value={formData.confirmPassword}
                    error={formErrorData.confirmPassword}
                />
                {apiError && <span className="small text-danger">{apiError}</span>}
                <Button 
                    className="mt-2" 
                    onClick={handleClick}
                    variant="primary" 
                >
                    Sign Up
                </Button>
            </div>
        </form>
        </>
    );
}

export default SignUp;