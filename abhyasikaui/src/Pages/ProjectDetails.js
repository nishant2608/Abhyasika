import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import './ProjectDetails.css'
import Table from '@mui/material/Table';
import Modal from '@mui/material/Modal';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, TextField, Button } from '@mui/material';
import AIChatWindow from '../Components/AIChatWindow';

const ProjectDetails = () => {
    const { pid } = useParams();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [chapterName, setChapterName] = useState('');
    const [chapterDescription, setChapterDescription] = useState('');
    const [editAccess, setEditAccess] = useState(false);
    const [project, setProject] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [user, setUser] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const getUser = () => {
        const jwtToken = getCookie('jwtToken');
        fetch('http://localhost:8080/user/verify', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch((error) => console.error('Error fetching user:', error));
    };

    const fetchProject = () => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/v1/user/project/' + pid;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setProject(data.project);
                setEditAccess(data.editAccess);
            }).catch((error) => console.error('Error fetching project:', error));
    };

    const fetchChapters = () => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/c/project/' + pid + '/chapter';
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setChapters(data);
            }).catch((error) => console.error('Error fetching chapters:', error));
    };

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    }

    const handleCreateChapter = () => {
        const jwtToken = getCookie('jwtToken');
        const newChapter = { name: chapterName, description: chapterDescription };
        fetch('http://localhost:8080/api/c/project/' + project.pid + '/chapter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newChapter),
          })
            .then(response => {
              if (response.status === 200) {
                setOpenModal(false);
                fetchChapters();
              } else {
                console.error('Failed to create project');
              }
            });
        };

    useEffect(() => {
        getUser();
        fetchProject();
        fetchChapters();
    },[]);

    return (
        <div className='Project-Page'>
            <div className='Abhyasika-Header'>

            </div>
            <div className='Project-List-Container'>
                <div className='Project-Details' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='Project-Details-Header'>
                        <h1 className='Project-Name'>{project ? project.name : 'Loading...'}</h1>
                        <p className='Project-Description'>{project ? project.description : 'Loading...'}</p>
                    </div>
                    <div className='Chapter-List-Header'>
                        <h1>Chapter List</h1>
                        <input
                            type='text'
                            placeholder='Search'
                            value={searchTerm}
                            onChange={handleSearch}
                            className='Search-Input'
                        />{editAccess &&
                            <div className='Filter-Button' style={{ cursor: 'pointer', marginLeft: '3em' }} onClick={() => setOpenModal(true)}>
                                Create
                            </div>
                        }
                        {project && user && project.owner.username===user.username &&
                            <div className='Filter-Button' style={{ cursor: 'pointer', marginLeft: '3em' }} onClick={() => navigate(`/projects/${project.pid}/settings`)}>
                                Settings
                            </div>
                        }
                    </div>
                    <div className='Chapter-List-Table'>
                        <TableContainer component={Paper}>
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Index</TableCell>
                                        <TableCell>Chapter Name</TableCell>
                                        <TableCell>Topics</TableCell>
                                        <TableCell>Quizzes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {chapters && chapters.map((chapter, index) => (
                                        <TableRow key={chapter.cid} onClick={() => navigate(`/projects/${project.pid}/chapter/${chapter.cid}`)}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{chapter.name}</TableCell>
                                            <TableCell>{chapter.topics === null ? 0 : chapter.topics.length}</TableCell>
                                            <TableCell>{chapter.quizzes === null ? 0 : chapter.quizzes.length}</TableCell>
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
                    {isChatOpen &&<AIChatWindow />}
                    </div>
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
            <h2 style={{color:'black'}}>Create New Chapter</h2>
            <TextField
              label="Chapter Name"
              variant="outlined"
              fullWidth
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={chapterDescription}
              onChange={(e) => setChapterDescription(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateChapter}
              style={{ marginTop: 20, marginLeft: 30 }}
            >
              Save
            </Button>
          </Box>
        </Modal>
        </div>
    )

}

export default ProjectDetails;