import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectList.css';
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { Box, TextField, Button } from '@mui/material';


const Projects = () => {
    const [filter, setFilter] = useState('my');
    const [projects, setProjects] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [projectPublic, setProjectPublic] = useState(false);
    const navigate = useNavigate();
    const [hoveredButton, setHoveredButton] = useState(null);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchProjects = (query = '') => {
        const jwtToken = getCookie('jwtToken');
        let url = '';
        switch (filter) {
            case 'all':
                url = 'http://localhost:8080/api/v1/project/public';
                break;
            case 'my':
                url = 'http://localhost:8080/api/v1/user/ownedProjects';
                break;
            case 'view':
                url = 'http://localhost:8080/api/v1/user/viewProjects';
                break;
            case 'edit':
                url = 'http://localhost:8080/api/v1/user/editProjects';
                break;
            default:
                url = 'http://localhost:8080/api/v1/project/public';
                break;
        }
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => setProjects(data))
            .catch((error) => console.error('Error fetching projects:', error));
    };

    useEffect(() => {
        fetchProjects();
    }, [filter]);

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleMouseEnter = (button) => {
        setHoveredButton(button);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateProject = () => {
        const jwtToken = getCookie('jwtToken');
        const newProject = { name: projectName, description: projectDescription, public: projectPublic };
        fetch('http://localhost:8080/api/v1/user/project', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newProject),
          })
            .then(response => {
              if (response.status === 201) {
                setOpenModal(false);
                fetchProjects();
              } else {
                console.error('Failed to create project');
              }
            });
    };

    


    return (
        <div className='Project-Page'>
            <div className='Abhyasika-Header'>

            </div>
            <div className='Project-List-Container'>
                <div className='Project-List' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='Project-Filters'>
                        {['my', 'view', 'edit', 'all'].map((btn) => (
                            <div
                                key={btn}
                                className='Filter-Button'
                                onClick={() => setFilter(btn)}
                                onMouseEnter={() => handleMouseEnter(btn)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    backgroundColor: filter === btn || hoveredButton === btn ? '#777373' : '#262528',
                                    cursor: 'pointer'
                                }}
                            >
                                {btn.charAt(0).toUpperCase() + btn.slice(1)}
                            </div>
                        ))}
                    </div>
                    <div className='Project-List-Header'>
                        <h1>Project List</h1>
                        <input
                            type='text'
                            placeholder='Search'
                            value={searchTerm}
                            onChange={handleSearch}
                            className='Search-Input'
                        />
                        <div className='Filter-Button' style={{cursor:'pointer', marginLeft:'3em'}}onClick={() => setOpenModal(true)}>
                            Create
                            </div>
                    </div>
                    <div className='Project-List-Table'>
                        <TableContainer component={Paper}>
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Index</TableCell>
                                        <TableCell>Project Name</TableCell>
                                        <TableCell>Owner</TableCell>
                                        <TableCell>Chapters</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projects.map((project, index) => (
                                        <TableRow key={project.pid} onClick={() => navigate(`/projects/${project.pid}`)}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{project.name}</TableCell>
                                            <TableCell>{project.owner.username}</TableCell>
                                            <TableCell>{project.chapters ===null? 0 :project.chapters.length}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <div className='Chatbox-Window' style={{ width: isChatOpen ? '25%' : '3%' }}>
                    <div className='Button-Window' onClick={handleChat} style={{ width: isChatOpen ? '12%' : '100%' }}>

                    </div>
                    <div className='Chat-Window' style={{ width: isChatOpen ? '88%' : '0%' }}>

                    </div>
                </div>
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
            <h2 style={{color:'black'}}>Create New Project</h2>
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
            <Checkbox
                checked={projectPublic}
                onChange={(e) => setProjectPublic(e.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
                />
                <span style={{color:'black'}}>Public</span>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateProject}
              style={{ marginTop: 20, marginLeft: 30 }}
            >
              Save
            </Button>
          </Box>
        </Modal>
            </div>
        </div>
    )
}

export default Projects;