import { responsiveFontSizes } from '@mui/material';
import React, { useState } from 'react';
import { Navigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [flag,setFlag] = useState(true);
    const [success,setSuccess] = useState(false);
    const [newUser,setNewUser] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.status === 401) {
                // Set a flag to indicate unauthorized access
                setFlag(false);
                console.log('Unauthorized access. Please check your credentials.');
            } else if (response.status === 200) {
                return response.text().then(text => {
                    console.log('Login successful:', { username, password });
                    document.cookie = `jwtToken=${text}; path=/;`;
                    console.log(document.cookie);
                    setSuccess(true);
                });
            } else {
                console.log('Unexpected response:', response.status);
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
        });
    };

    // const getProjects = ()=>{
    //     const jwtToken = getCookie('jwtToken');
    //     fetch('http://localhost:8080/api/v1/user/project',{
    //         method:'GET',
    //         headers: {
    //             Authorization: `Bearer ${jwtToken}`
    //         }
    //     })
    //     .then((response)=>{
    //         console.log(response);
    //     })
    //     .catch((e)=>{
    //         console.log(e);
    //     })
    // }

    // const getCookie = (name) => {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop().split(';').shift();
    // };


    return (
        <div className='App-header'>
            {success&&(<Navigate to="/projects" replace={true} />)}
            {newUser&&(<Navigate to="/register" replace={true} />)}
            <h2>Login</h2>
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
                </div >
                {flag?(<div></div>):(<div>Invalid username or password</div>)}
                <button type="submit">Login</button>
                <button onClick={()=>{setNewUser(true)}}>Register </button>
            </form>
        </div>
    );
};

export default Login;
