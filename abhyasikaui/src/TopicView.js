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
import { Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';

const TopicView = () => {
    const { id, cid, tid } = useParams();
    const [project, setProject] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [topic, setTopic] = useState(null);
    const [openChapters, setOpenChapters] = useState({});

    useEffect(() => {
        fetch('/demoTopic.project.json')
            .then((response) => response.json())
            .then((data) => {
                const foundProject = data.find((p) => p._id.$oid === id);
                setProject(foundProject);
                return foundProject;
            })
            .then((p) => {
                const foundChapter = p.chapters.find((c) => c._id === cid);
                setChapter(foundChapter);
                return foundChapter;
            })
            .then((c) => {
                const foundTopic = c.topics.find((t) => t._id === tid);
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

    if (!project || !chapter) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <div className='page'>
            <div className='topicview'>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={<ListSubheader component="div" id="nested-list-subheader">
                        {project.name}
                    </ListSubheader>}
                >
                     {project.chapters.map((chapter,index1)=>(
                        <div>
                        <ListItemButton onClick={()=>handleToggle(chapter._id)}>
                            <ListItemIcon>
                                <FolderIcon />
                            </ListItemIcon>
                            <ListItemText primary={chapter.name} />
                            {openChapters[chapter._id] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                         <Collapse in={openChapters[chapter._id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {chapter.topics.map((topic,index2)=>(
                                    <ListItemButton onClick={()=>setTopic(topic)}>
                                        <ListItemIcon>
                                            <ArticleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={topic.name} />
                                    </ListItemButton>
                                ))}
                            </List>
                         </Collapse>
                         </div>
                     ))}   

                </List>
            </div>
        </div>
    )



}

export default TopicView;