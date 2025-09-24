import React, { useState } from "react";
import { Button } from "react-bootstrap";

function Input({ inputFor }) {
    return (
        <>
        <input
            id={inputFor.toLowerCase().replace(" ", "-")}
            className="m-2"
            placeholder={inputFor}
        />
        </>
    );
}

export default function SignUp() {
    const [formData, setFormData] = useState();
    return (
        <>
        <form>
            <div className="d-flex flex-column align-items-center">
                <p>Sign-up</p>
                <Input inputFor="Name" />
                <Input inputFor="Email" />
                <Input inputFor="Phone" />
                <Input inputFor="Password" />
                <Input inputFor="Confirm Password" />
                <Button variant="primary">Sign Up</Button>
            </div>
        </form>
        </>
    );
}