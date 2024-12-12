import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Modal, Box, TextField, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import '@fontsource/roboto/400.css';
import AddIcon from '@mui/icons-material/Add'

const TopicList = () => {
  const { id, cid } = useParams();
  const [project, setProject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [topicName, setTopicName] = useState('');
  const navigate = useNavigate();

  const handleClick = (topic) => {
    // alert(`Clicked on ${topic.name} (ID: ${topic._id})`);
    const topicPath = '/projects/' + project.pid + '/' + chapter.cid + '/' + topic.tid;
    navigate(topicPath);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const fetchTopics = () => {
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
      }).then((p) => {
        const foundChapter = p.chapters.find((c) => c.cid === cid);
        setChapter(foundChapter);
      })
      .catch((error) => console.error('Error fetching project:', error));
  }

  useEffect(() => {
    fetchTopics();
  }, [id]);

  const handleCreateTopic = () => {
    const jwtToken = getCookie('jwtToken');
    const newTopic = { name: topicName };
    const url = 'http://localhost:8080/api/v1/project/' + id + '/chapters/' + cid + '/topics';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(newTopic),
    })
      .then(response => {
        if (response.status === 201) {
          // Optionally refresh the project list
          // setProjects([...projects, newProject]);
          setOpenModal(false);
          fetchTopics();
        } else {
          // Handle error
          console.error('Failed to create chapteer');
        }
      });

    setTopicName('');
  }

  if (!project || !chapter) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div className="page">
      <Container className='container'>
        <h1 className="header">{chapter.name}</h1>
        <Typography variant="body1">{chapter.description}</Typography>
        <div className="project-subheader">
        <Typography variant="h5" color='secondary'>Topics</Typography>
        <IconButton
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          <AddIcon />
        </IconButton>
        </div>
        {chapter.topics === null ? (<Typography variant="h6" style={{ color: '#ececec', textAlign: 'center' }}>
          No topics found
        </Typography>) : (<List>
          {chapter.topics.map((topic, index) => (
            <ListItem key={topic.tid} className="listItem">
              <ListItemButton onClick={() => handleClick(topic)}>
                <ListItemIcon>
                  <ArticleIcon color='success' />
                </ListItemIcon>
                <ListItemText
                  primary={<span style={{ color: '#ececec' }}>{topic.name}</span>}
                  secondary={<span className="projectId">ID: {topic.tid}</span>}
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
            <h2>Create New Topic</h2>
            <TextField
              label="Topic Name"
              variant="outlined"
              fullWidth
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateTopic}
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

export default TopicList;