import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import { Button } from '@mui/material';

const TextEditor = ({ topic, pid, cid }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editorContent, setEditorContent] = useState(''); // Initial content

    useEffect(() => {
        setEditorContent(topic.content);
    }, [topic])

    const handleEdit = () => {
        setIsEditing(true);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleSave = () => {
        const jwtToken = getCookie('jwtToken');
        const newTopic = { name: topic.name, tid: topic.tid, content: editorContent };
        const url = 'http://localhost:8080/api/v1/project/' + pid + '/chapters/' + cid + '/topics/' + topic.tid;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newTopic),
        })
            .then(response => {
                if (response.status === 200) {
                    setIsEditing(false);

                } else {
                    // Handle error
                    console.error('Failed to create chapteer');
                }
            });
    }

    const handleCancel = () => {
        setIsEditing(false); // Exit editing mode without saving
        setEditorContent(topic.content); // Reset editor content to saved content
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <ReactQuill
                        value={editorContent}
                        onChange={setEditorContent}
                    />
                </div>
            ) : (
                <div>
                    <Button onClick={handleEdit}>Edit</Button>
                    <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                </div>
            )}
        </div>
    );
};

export default TextEditor;
