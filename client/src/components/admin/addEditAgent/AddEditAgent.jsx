import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { axiosInstance, getToken } from "../../../api/axiosInstance";

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
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        skills: '',
        name: '',
        password: '',
        languages: '',
        isAdmin: false,
        phoneNo: '',
    });
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    function updateField(e) {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function handleChange(value) {
        setMode(value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (mode === "add") {
            const languages = formData.languages.split(',');
            const skills = formData.skills.split(',');
            const data = {
                name: formData.name,
                email: formData.email,
                languagesKnown: languages,
                password: formData.password,
                skills: skills,
                isAdmin: formData.isAdmin,
                phoneNo: formData.phoneNo,
            };

            try {
                const response = await axiosInstance.post(
                    "/api/admin/addAgent",
                    data,
                    {
                        headers: {
                            "Authorization": `Bearer ${getToken()}`
                        }
                    }
                );
                setResponseMessage(response.data.message);
                setError('');
            } catch (err) {
                setError(err?.response?.data?.error);
                setResponseMessage('');
                console.error(err);
            }
        } else if (mode === "edit") {
            const languages = formData.languages.split(',');
            const skills = formData.skills.split(',');
            const data = {
                id: formData.id,
                name: formData.name,
                email: formData.email,
                languagesKnown: languages,
                skills: skills,
                isAdmin: formData.isAdmin,
                phoneNo: formData.phoneNo,
            };

            try {
                const response = await axiosInstance.put(
                    "/api/admin/updateAgent",
                    data,
                    {
                        headers: {
                            "Authorization": `Bearer ${getToken()}`
                        }
                    }
                );
                setResponseMessage(response.data.message);
                setError('');
            } catch (err) {
                setError(err.response.data.error);
                setResponseMessage('');
                console.error(err);
            }
        }
    }

    return (
        <Container className="p-0">
            <form className="d-flex flex-column align-items-start" onSubmit={handleSubmit}>
                <select
                    id="mode"
                    value={mode}
                    onChange={(e) => handleChange(e.target.value)}
                >
                    <option value="add">Add</option>
                    <option value="edit">Update</option>
                </select>

                {mode === "edit" && <InputField
                    name="id"
                    type="number"
                    placeholder="Agent Id"
                    value={formData.id}
                    onChange={updateField}
                />}

                <InputField
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={updateField}
                />

                <InputField
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={updateField}
                />

                <InputField
                    name="skills"
                    type="text"
                    placeholder="Skills"
                    value={formData.skills}
                    onChange={updateField}
                />

                {mode === "add" && <InputField
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={updateField}
                />}

                <InputField
                    name="languages"
                    type="text"
                    placeholder="Languages"
                    value={formData.languages}
                    onChange={updateField}
                />

                <label>
                    <input
                        className="me-2"
                        type="checkbox"
                        name="isAdmin"
                        checked={formData.isAdmin}
                        onChange={updateField}
                    />
                    Is Admin
                </label>

                <InputField
                    name="phoneNo"
                    type="text"
                    placeholder="Phone no"
                    value={formData.phoneNo}
                    onChange={updateField}
                />

                {responseMessage && <span style={{ color: "limegreen" }}>{responseMessage}</span>}
                {error && <span className="text-danger">{error}</span>}

                <Button
                    type="submit"
                    className="my-2"
                >
                    {mode === 'add' ? 'Add Agent' : 'Update Agent'}
                </Button>
            </form>
        </Container>
    )
}

export default AddEditAgent;