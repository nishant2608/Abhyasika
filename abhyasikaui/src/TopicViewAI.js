import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArticleIcon from '@mui/icons-material/Article';
import { Drawer, Typography, IconButton, Button, Menu } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import './TopicView.css'
import './TopicViewAI.css'
import Paper from '@mui/material/Paper';
import TextEditor from './TextEditor';
import ChatIcon from '@mui/icons-material/Chat';
import MenuIcon from '@mui/icons-material/Menu';
import AiChat from './AiChat';
import {Box} from '@mui/material';
import AiChatBox from './AiChatBox';

const TopicViewAI = () => {
    const { id, cid, tid } = useParams();
    const [project, setProject] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [topic, setTopic] = useState(null);
    const [openChapters, setOpenChapters] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const calcWidth =(isChatOpen, isMenuOpen) => {
        if(isChatOpen && isMenuOpen){
            return '60%';
        }
        if(isChatOpen){
            return '75%';
        }
        if(isMenuOpen){
            return '85%';
        }
        return '100%';
    }

    useEffect(() => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/v1/project/' + id;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setProject(data);
                return data;
            })
            .then((p) => {
                const foundChapter = p.chapters.find((c) => c.cid === cid);
                setChapter(foundChapter);
                setOpenChapters((prev) => ({
                    ...prev, [foundChapter.cid]: true
                }))
                return foundChapter;
            })
            .then((c) => {
                const foundTopic = c.topics.find((t) => t.tid === tid);
                setTopic(foundTopic);
            })
            .catch((error) => console.error('Error fetching project:', error));
    }, [id]);

    const handleToggle = (cid) => {
        setOpenChapters((prev) => ({
            ...prev,
            [cid]: !prev[cid],
        }));
    }

    const handleChange = (chapter, t) => {
        setTopic(t);
        setChapter(chapter);
    }

    if (!project || !chapter) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return(
        <div className='topicAIscreen'>
            {isMenuOpen && 
            <div style={{ width: isMenuOpen?'15%': '0%'}}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#131315', color: '#ececec', height: '100vh', overflow: 'auto',scrollbarWidth: 'none' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={<ListSubheader component="div" id="nested-list-subheader" >
                            {project.name}
                        </ListSubheader>}
                    >
                        {project.chapters.map((chapter, index1) => (
                            <div>
                                <ListItemButton onClick={() => handleToggle(chapter.cid)}>
                                    <ListItemIcon>
                                        <FolderIcon color='success' />
                                    </ListItemIcon>
                                    <ListItemText primary={chapter.name} />
                                    {openChapters[chapter.cid] ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openChapters[chapter.cid]} timeout="auto" unmountOnExit>
                                    {chapter.topics !== null && (<List component="div" disablePadding>
                                        {chapter.topics.map((t, index2) => (
                                            <ListItemButton onClick={() => { handleChange(chapter, t) }} style={{ backgroundColor: t.tid === topic.tid ? '#a7b7af' : 'inherit' }}>
                                                <ListItemIcon>
                                                    <ArticleIcon color='success' />
                                                </ListItemIcon>
                                                <ListItemText primary={t.name} />
                                            </ListItemButton>
                                        ))}
                                    </List>)}
                                </Collapse>
                            </div>
                        ))}

                    </List>
            </div> }
        <div style={{ width: calcWidth(isChatOpen,isMenuOpen), backgroundColor: '#343437', overflow: 'auto', color: '#ececec',scrollbarWidth:'none' }}>
            <div className='contentHeader'>
            <IconButton onClick={toggleMenu} color='primary'>
                <MenuIcon />
            </IconButton>
            <IconButton onClick={toggleChat} color='primary'>
                <ChatIcon />
            </IconButton>
            </div>
            <TextEditor topic={topic} pid={project.pid} cid={chapter.cid}/>
        </div>
        {isChatOpen &&
        <div style={{ width: isChatOpen?'25%':'0%' }}>
            <AiChat />
        </div>
        }
        </div>
    )

}

export default TopicViewAI;