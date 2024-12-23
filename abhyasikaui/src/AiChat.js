import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import ReactMarkdown from 'react-markdown';

const AiChat = () => {
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
        // <div className='chatbox'>
        <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '12px' }}
            role="presentation"
        >
            <div className='ai-header'>
                <h2>AI Chatbox</h2>
                <Button variant='text' color='secondary' onClick={() => setMessages([])}>Clear Chat</Button>
            </div>

            <List sx={{ height:'70%', overflow: 'auto' }} >
                {messages.map((msg, index) => (
                    <ListItem key={index} sx={{ justifyContent: msg.role === 'system' ? 'flex-start' : 'flex-end' }}>
                        <ListItemText
                            primary={<ReactMarkdown>{msg.content}</ReactMarkdown>}
                            sx={{
                                textAlign: msg.role === 'system' ? 'left' : 'right',
                                backgroundColor: msg.role === 'system' ? '#758194' : '#516263',
                                borderRadius: '10px',
                                padding: '10px',
                                maxWidth: '80%'
                            }}
                            disableTypography={true}
                        />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Type your message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    sx={{ marginLeft: '10px' }}
                >
                    Send
                </Button>
            </Box>
        </Box>
        // </div>
    );
};

export default AiChat;