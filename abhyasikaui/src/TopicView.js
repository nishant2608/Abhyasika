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
import { Drawer, Typography, IconButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import './TopicView.css'
import Paper from '@mui/material/Paper';
import TextEditor from './Pages/TextEditor';
import ChatIcon from '@mui/icons-material/Chat';
import AiChat from './AiChat';
import {Box} from '@mui/material';


const TopicView = () => {
    const { id, cid, tid } = useParams();
    const [project, setProject] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [topic, setTopic] = useState(null);
    const [openChapters, setOpenChapters] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    useEffect(() => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://43.204.91.223:8080/api/v1/project/' + id;
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

    return (
        <div className='page'>
            <Box sx={{ display: 'flex' }}>
                <div className='menuList'>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#131314', color: '#ececec' }}
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
                </div>
                <div className='content' style={{flexGrow: 1, transition: 'margin-left 0.3s'}}>
                    {/* <Paper elevation={3} sx={{ minHeight: '100%', backgroundColor: '#343437', color: '#ececec' }}>
                        <div className='topic-content'>
                            <div className='topic-name'>
                                <Typography variant="h5" color='secondary'>{topic.name}</Typography>
                            </div>
                            <div className='information'>
                                {topic.content}
                            </div>
                        </div>
                    </Paper> */}
                    <TextEditor topic={topic} pid={project.pid} cid={chapter.cid} />
                </div>
                <IconButton
                    onClick={toggleChat}
                    style={{ position: 'absolute', right: 0, top: 0 }}
                >
                    <ChatIcon />
                </IconButton>

                <Drawer
                    anchor="right"
                    open={isChatOpen}
                    onClose={toggleChat}
                    sx={{ width: isChatOpen ? 300 : 0 , flexShrink: 0 }}
                >
                    <AiChat />
                </Drawer>


            </Box>
        </div>
    )



}

export default TopicView;