// src/Projects.js

import React, { useEffect, useState } from 'react';
import { Container, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Modal, Box, TextField, Button, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Projects.css'; // Import your CSS file
import './Page.css';
import '@fontsource/roboto/400.css';
import AppsIcon from '@mui/icons-material/Apps';
import AddIcon from '@mui/icons-material/Add';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const fetchProjects = () => {
    const jwtToken = getCookie('jwtToken');
    fetch('http://localhost:8080/api/v1/user/project', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }

  useEffect(() => {
    fetchProjects();
  }, []);




  const handleClick = (project) => {
    // alert(`Clicked on ${project.name} (ID: ${project._id.$oid})`);
    const projectpath = '/projects/' + project.pid;
    navigate(projectpath);
  };

  const handleCreateProject = () => {
    // Post to API to create a new project
    const jwtToken = getCookie('jwtToken');
    const newProject = { name: projectName };

    fetch('http://localhost:8080/api/v1/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(newProject),
    })
      .then(response => {
        if (response.status === 201) {
          // Optionally refresh the project list
          // setProjects([...projects, newProject]);
          setOpenModal(false);
          fetchProjects();
        } else {
          // Handle error
          console.error('Failed to create project');
        }
      });

    setProjectName('');
    setProjectDescription('');
  };

  return (
    <div className='page'>
      <Container className="container">
        <h1 className="header">Project List</h1>
        {projects === null ? (<Typography variant="h6" style={{ color: '#ececec', textAlign: 'center' }}>
          No projects found
        </Typography>) :
          <List>
            {projects.map((project) => (
              <ListItem key={project.pid} className="listItem">
                <ListItemButton onClick={() => handleClick(project)}>
                  <ListItemIcon>
                    <AppsIcon color='success' />
                  </ListItemIcon>
                  <ListItemText
                    primary={<span style={{ color: '#ececec' }}>{project.name}</span>}
                    secondary={<span className="projectId">ID: {project.pid}</span>}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>}


        <IconButton
          color="primary"
          onClick={() => setOpenModal(true)}
          style={{ position: 'fixed', bottom: 20, right: 20 }}
        >
          <AddIcon />
        </IconButton>

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4
            }}
          >
            <h2>Create New Project</h2>
            <TextField
              label="Project Name"
              variant="outlined"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateProject}
              style={{ marginTop: 20 }}
            >
              Save
            </Button>
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default Projects;
