import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";

const AiChatBox = () => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = sessionStorage.getItem('messages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState('');

    useEffect(() => {
        sessionStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Simulate API request
        const systemResponse = await fetchSystemResponse(updatedMessages);
        setMessages(prevMessages => [...prevMessages, { role: 'system', content: systemResponse }]);

        setInput('');
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchSystemResponse = async (messages) => {
        // Replace with your actual API call
        try {
            const jwtToken = getCookie('jwtToken');
            console.log(jwtToken);
            const response = await fetch('http://localhost:5000/post/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    temperature: 0.7,
                    messages: messages
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error fetching system response:', error);
            return 'Error fetching system response';
        }

    };

    return (
        <div className="chatbox-container">
        <header className="chatbox-header">
          <h1>AI ChatBox</h1>
          <Button variant='text' color='secondary' onClick={() => setMessages([])}>Clear Chat</Button>
        </header>
        <div className="chatbox-conversation">
          {messages.map((msg, index) => (
            <div key={index} className="chatbox-message">
              {msg.content}
            </div>
          ))}
        </div>
        <div className="chatbox-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onSubmit={handleSend}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    );
};

export default AiChatBox;