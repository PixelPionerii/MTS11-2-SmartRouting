import React, { useState } from "react";
import { Container } from "react-bootstrap";

function InputField({
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    label,
    ...rest
}) {
    return (
        <input
            name={name}
            className="my-2"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rest}
        />
    );
}

function AddEditAgent() {
    const [mode, setMode] = useState("add");
    const [form, setForm] = useState({
        email: '',
        skills: '',
        name: '',
        password: '',
        languages: '',
        isAdmin: false,
        phoneNo: '',
    });

    function updateField(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function onChange(e) {

    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <Container className="p-0">
            <form className="d-flex flex-column align-items-start" onSubmit={handleSubmit}>
                <InputField
                    name="email"
                    type="email"
                    placeholder="email"
                    value={form.email}
                    onChange={updateField}
                />

                <InputField
                    name="skills"
                    type="text"
                    placeholder="skills"
                    value={form.skills}
                    onChange={updateField}
                />

                <InputField
                    name="name"
                    type="text"
                    placeholder="name"
                    value={form.name}
                    onChange={updateField}
                />

                <InputField
                    name="password"
                    type="password"
                    placeholder="password"
                    value={form.password}
                    onChange={updateField}
                />

                <InputField
                    name="languages"
                    type="text"
                    placeholder="languages"
                    value={form.languages}
                    onChange={updateField}
                />

                <label>
                    <input
                        className="me-2"
                        type="checkbox"
                        name="isAdmin"
                        checked={form.isAdmin}
                        onChange={updateField}
                    />
                    Is Admin
                </label>

                <InputField
                    name="phoneNo"
                    type="text"
                    placeholder="Phone no"
                    value={form.phoneNo}
                    onChange={updateField}
                />
                <Button
                    type="submit"
                >
                    {mode === 'add' ? 'Add Agents' : 'Update Agent'}
                </Button>
            </form>
        </Container>
    )
}

export default AddEditAgent;