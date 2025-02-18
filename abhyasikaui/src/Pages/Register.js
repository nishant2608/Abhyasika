import './Register.css';
import React, { useState } from 'react';
import { use } from 'react';
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [school, setSchool] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userflag,setUserflag] = useState(false);
    const [passflag,setPassflag] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if(password !== confirmPassword){
            setPassflag(true);
            return;
        }
        else{
            setPassflag(false);
        }
        fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, school, password, email })
        })
            .then(response => {
                if (response.status === 400) {
                    // Set a flag to indicate bad request
                    setUserflag(true);
                    console.log('Bad request. Please try again.');
                } else if (response.status === 200) {
                    return response.text().then(text => {
                        console.log('Registration successful:', { name, username, school, password, email });
                        console.log(text);
                        navigate('/login');
                    });
                } else {
                    console.log('Unexpected response:', response.status);
                }
            })
            .catch(error => {
                console.error('Error during registration:', error);
            });
    };

    return(
        <div className="register-page-1">
            <div className="register-box-1">
            <h1>Register Page</h1>
            <div>
            {passflag && <p style={{ color: 'red' }}>Passwords do not match!</p>}
            {userflag && <p style={{ color: 'red' }}>Username is not valid or already exists</p>}
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
                        <label className='register-label' htmlFor="username">Username(atleast 5 chars):</label>
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
                    <button onClick={handleSubmit}>Register</button>
                </div>
            </div>
        </div>
    )
}

export default Register;