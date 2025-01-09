import './Register.css';
import React, { useState } from 'react';

const Register = () => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [school, setSchool] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
    };

    return(
        <div className="register-page-1">
            <div className="register-box-1">
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                    <div className='register-fields-1'>
                        <label className='register-label' htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='register-fields-1'>
                        <label className='register-label' htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='register-fields-1'>
                        <label className='register-label' htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='register-fields-1'>
                        <label className='register-label' htmlFor="school">School:</label>
                        <input
                            type="text"
                            id="school"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            required
                        />
                    </div>
                    <div className='register-fields-1'>
                        <label className='register-label' htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='register-fields-1'>
                        <label className='register-label' htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Register;