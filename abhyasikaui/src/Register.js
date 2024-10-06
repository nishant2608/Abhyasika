import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success,setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
        setSuccess(true);
        console.log('Registering:', { username, password });
    };

    return (
        <div>
            {success && (<Navigate to="/login" replace={true} />)}
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
