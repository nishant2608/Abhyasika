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
        if(username=="u1" && password=="p1"){
            setSuccess(true);
        }
        else{
            setFlag(false);
        }
        console.log('Logging in:', { username, password });
    };


    return (
        <div className='App-header'>
            {success&&(<Navigate to="/" replace={true} />)}
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
