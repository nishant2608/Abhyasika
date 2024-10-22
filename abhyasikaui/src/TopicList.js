import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import '@fontsource/roboto/400.css';

const TopicList = () => {
  const { id ,cid} = useParams();
  const [project, setProject] = useState(null);
  const [chapter,setChapter] = useState(null);
  const navigate = useNavigate();

  const handleClick = (topic) => {
    // alert(`Clicked on ${topic.name} (ID: ${topic._id})`);
    const topicPath = '/projects/' + project.pid +'/' + chapter.cid + '/' + topic.tid;
    navigate(topicPath);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

  useEffect(() => {
    const jwtToken = getCookie('jwtToken');
    const url = 'http://localhost:8080/api/v1/project/' + id;
        fetch(url,{
            method:'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
      .then((response) => response.json())
      .then((data) => {
        setProject(data);
        return data;
      }).then((p)=>{
        const foundChapter = p.chapters.find((c)=>c.cid===cid);
        setChapter(foundChapter);
      })
      .catch((error) => console.error('Error fetching project:', error));
  }, [id]);

  if (!project || !chapter) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div className="page">
      <Container className='container'>
      <h1 className="header">{chapter.name}</h1>
      <Typography variant="body1">{chapter.description}</Typography>
      <Typography variant="h5" color='secondary'>Topics</Typography>
      <List>
        {chapter.topics.map((topic, index) => (
          <ListItem key={topic.tid} className="listItem">
          <ListItemButton onClick={() => handleClick(topic)}>
            <ListItemIcon>
              <ArticleIcon color='success'/>
            </ListItemIcon>
            <ListItemText 
              primary={<span style={{color:'#ececec'}}>{topic.name}</span>} 
              secondary={<span className="projectId">ID: {topic.tid}</span>} 
            />
          </ListItemButton>
        </ListItem>
        ))}
      </List>
    </Container>
    </div>
  );
};

export default TopicList;