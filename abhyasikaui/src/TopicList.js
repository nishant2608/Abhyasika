import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import '@fontsource/roboto/400.css';

const TopicList = () => {
  const { id ,cid} = useParams();
  const [project, setProject] = useState(null);
  const [chapter,setChapter] = useState(null);

  const handleClick = (topic) => {
    alert(`Clicked on ${topic.name} (ID: ${topic._id})`);
    // const projectpath = '/projects/' + project._id.$oid;
    // navigate(projectpath);
  };

  useEffect(() => {
    fetch('/demoTopic.project.json')
      .then((response) => response.json())
      .then((data) => {
        const foundProject = data.find((p) => p._id.$oid=== id);
        setProject(foundProject);
        return foundProject;
      }).then((p)=>{
        const foundChapter = p.chapters.find((c)=>c._id===cid);
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
          <ListItem key={topic._id} className="listItem">
          <ListItemButton onClick={() => handleClick(topic)}>
            <ListItemText 
              primary={<span style={{color:'#ececec'}}>{topic.name}</span>} 
              secondary={<span className="projectId">ID: {topic._id}</span>} 
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