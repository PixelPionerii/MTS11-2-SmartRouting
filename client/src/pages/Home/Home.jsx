import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const roles = ["admin", "agent", "customer"];
        try {
            let creds = localStorage.getItem("creds");
            creds = JSON.parse(creds);
            
            if (creds && roles.includes(creds.role) && creds.token) {
                navigate("/dashboard");
            } else {
                navigate("/login");
            }
        } catch(error) {
            navigate("/login");
        }
    }, []);
 
    return (
        <></>
    );
}

export default Home;