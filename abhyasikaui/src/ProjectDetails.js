import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '@fontsource/roboto/400.css';
import FolderIcon from '@mui/icons-material/Folder';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  const handleClick = (chapter) => {
    // alert(`Clicked on ${chapter.name} (ID: ${chapter._id})`);
    const chapterpath = '/projects/' + project.pid+ '/' + chapter.cid;
    navigate(chapterpath);
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
      })
      .catch((error) => console.error('Error fetching project:', error));
  }, [id]);

  if (!project) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  

  return (
    <div className="page">
      <Container className='container'>
      <h1 className="header">{project.name}</h1>
      <Typography variant="body1">{project.description}</Typography>
      <Typography variant="h5" color='secondary'>Chapters</Typography>
      <List>
        {project.chapters.map((chapter, index) => (
          <ListItem key={chapter.cid} className="listItem">
          <ListItemButton onClick={() => handleClick(chapter)}>
            <ListItemIcon>
              <FolderIcon color='success'/>
            </ListItemIcon>
            <ListItemText 
              primary={<span style={{color:'#ececec'}}>{chapter.name}</span>} 
              secondary={<span className="projectId">ID: {chapter.cid}</span>} 
            />
          </ListItemButton>
        </ListItem>
        ))}
      </List>
    </Container>
    </div>
  );
};

export default ProjectDetail;