import './Login.css';
import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
const Login = () =>{

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [flag, setFlag] = useState(true);
    const [success, setSuccess] = useState(false);
    const [newUser, setNewUser] = useState(false);


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

    return(
        
        <div className="login-page-1">
            {success && (<Navigate to="/projects" replace={true} />)}
            {newUser && (<Navigate to="/register" replace={true} />)}
            <div className="login-box-1">
                <div className='login-header-1'>
                <h1>LOGIN</h1>
                </div>
                <div className="login-fields-1">
                <input className="username-1" onChange={(e)=>setUsername(e.target.value)} type='username' placeholder='Username'></input>
                <input className="password-1" onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Password'></input>
                <div className='buttons-1'>
                <button className="login-button-1" onClick={handleSubmit}>Login</button>
                <button className="register-button-1" onClick={()=>setNewUser(true)}>Register</button>
                </div>
                {flag?(<div></div>):(<div className='login-invalid'>Invalid username or password</div>)}
                </div>
            </div>
        </div>
    )
}

export default Login;