// src/Projects.js

import React, { useEffect, useState } from 'react';
import { Container, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Projects.css'; // Import your CSS file
import './Page.css';
import '@fontsource/roboto/400.css';
import AppsIcon from '@mui/icons-material/Apps';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

  useEffect(() => {
    const jwtToken = getCookie('jwtToken');
        fetch('http://localhost:8080/api/v1/user/project',{
            method:'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);


    

  const handleClick = (project) => {
    // alert(`Clicked on ${project.name} (ID: ${project._id.$oid})`);
    const projectpath = '/projects/' + project.pid;
    navigate(projectpath);
  };

  return (
    <div className='page'>
    <Container className="container">
      <h1 className="header">Project List</h1>
      <List>
        {projects.map((project) => (
          <ListItem key={project.pid} className="listItem">
            <ListItemButton onClick={() => handleClick(project)}>
              <ListItemIcon>
                <AppsIcon color='success'/>
              </ListItemIcon>
              <ListItemText 
                primary={<span style={{color:'#ececec'}}>{project.name}</span>} 
                secondary={<span className="projectId">ID: {project.pid}</span>} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
    </div>
  );
};

export default Projects;
