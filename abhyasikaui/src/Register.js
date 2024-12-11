import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success,setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
        fetch('http://localhost:8080/register',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }).then((response)=>{
            if(response.status==200){
                setSuccess(true);
                console.log("registering users:",{username,password});
            }
        })
        console.log('Registering:', { username, password });
    };

    return (
        <div className='App-header'>
            {success && (<Navigate to="/login" replace={true} />)}
            <div className='login-container'>
            <h2 className='login-header'>Register</h2>
            <div className='login-box'>
                    <TextField  className="login-fields" id="outlined-basic" label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white', // Set background color to white
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black', // Set label color to black for better contrast (optional)
                        },
                    }} />
                    <TextField className="login-fields" id="outlined-basic" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white', // Set background color to white
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black', // Set label color to black for better contrast (optional)
                        },
                    }} />
          <Button variant="outlined" onClick={handleSubmit} sx={{
          backgroundColor: '#5C27B6', // Custom background color
          color: 'white'}}>Register</Button>
                </div>
            </div>
        </div>
    );
};

export default Register;
