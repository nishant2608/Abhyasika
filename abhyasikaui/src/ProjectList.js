// src/Projects.js

import React, { useEffect, useState } from 'react';
import { Container, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Projects.css'; // Import your CSS file
import './Page.css';
import '@fontsource/roboto/400.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/demoTopic.project.json')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleClick = (project) => {
    // alert(`Clicked on ${project.name} (ID: ${project._id.$oid})`);
    const projectpath = '/projects/' + project._id.$oid;
    navigate(projectpath);
  };

  return (
    <div className='page'>
    <Container className="container">
      <h1 className="header">Project List</h1>
      <List>
        {projects.map((project) => (
          <ListItem key={project.id} className="listItem">
            <ListItemButton onClick={() => handleClick(project)}>
              <ListItemText 
                primary={<span style={{color:'#ececec'}}>{project.name}</span>} 
                secondary={<span className="projectId">ID: {project._id.$oid}</span>} 
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
