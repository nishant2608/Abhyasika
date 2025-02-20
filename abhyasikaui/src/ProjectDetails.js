import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Modal, Box, TextField, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '@fontsource/roboto/400.css';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add'

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [chapterName, setChapterName] = useState('');

  const handleClick = (chapter) => {
    // alert(`Clicked on ${chapter.name} (ID: ${chapter._id})`);
    const chapterpath = '/projects/' + project.pid + '/' + chapter.cid;
    navigate(chapterpath);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const fetchChapters = () => {
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
      })
      .catch((error) => console.error('Error fetching project:', error));
  }

  useEffect(() => {
    fetchChapters();
  }, [id]);

  const handleCreateChapter = () => {
    const jwtToken = getCookie('jwtToken');
    const newChapter = { name: chapterName };
    const url = 'http://43.204.91.223:8080/api/v1/project/' + id + '/chapters'

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(newChapter),
    })
      .then(response => {
        if (response.status === 201) {
          // Optionally refresh the project list
          // setProjects([...projects, newProject]);
          setOpenModal(false);
          fetchChapters();
        } else {
          // Handle error
          console.error('Failed to create chapteer');
        }
      });

    setChapterName('');
  }

  if (!project) {
    return <Typography variant="h6">Loading...</Typography>;
  }



  return (
    <div className="page">
      <Container className='container'>
        <h1 className="header">{project.name}</h1>
        <Typography variant="body1">{project.description}</Typography>
        <div className='project-subheader'>
        <Typography variant="h5" color='secondary'>Chapters</Typography>
        <IconButton
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          <AddIcon />
        </IconButton>
        </div>
        {project.chapters === null ? (<Typography variant="h6" style={{ color: '#ececec', textAlign: 'center' }}>
          No chapters found
        </Typography>) : (<List>
          {project.chapters.map((chapter, index) => (
            <ListItem key={chapter.cid} className="listItem">
              <ListItemButton onClick={() => handleClick(chapter)}>
                <ListItemIcon>
                  <FolderIcon color='success' />
                </ListItemIcon>
                <ListItemText
                  primary={<span style={{ color: '#ececec' }}>{chapter.name}</span>}
                  secondary={<span className="projectId">ID: {chapter.cid}</span>}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>)}



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
            <h2>Create New Chapter</h2>
            <TextField
              label="Chapter Name"
              variant="outlined"
              fullWidth
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateChapter}
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

export default ProjectDetail;