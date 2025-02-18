import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
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


const ChapterDetails = () => {
    const { pid, cid } = useParams();
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [editAccess, setEditAccess] = useState(false);
    const [project, setProject] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [topics, setTopics] = useState(null);
    const [quizzes, setQuizzes] = useState(null);
    const [topicName, setTopicName] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
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
        .then((response) => {
            if(response.status===401){
                navigate('/login')}
                else{
                    return response.json()}
                })
            .then((data) => {
                setProject(data.project);
                setEditAccess(data.editAccess);
            }).catch((error) => console.error('Error fetching project:', error));
    };

    const fetchChapter = () => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/c/project/' + pid + '/chapter/' + cid;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
        .then((response) => {
            if(response.status===401){
                navigate('/login')}
                else{
                    return response.json()}
                })
            .then((data) => {
                setChapter(data);
                setQuizzes(data.quizzes);
            }).catch((error) => console.error('Error fetching project:', error));
    };

    const fetchTopics = () => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/t/project/' + pid + '/chapter/' + cid + '/topic';
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
        .then((response) => {
            if(response.status===401){
                navigate('/login')}
                else{
                    return response.json()}
                })
            .then((data) => {
                setTopics(data);
            }).catch((error) => console.error('Error fetching chapters:', error));
    };

    const fetchScoreCard = (qid) => {
        const jwtToken = getCookie('jwtToken');
        const url = `http://localhost:8080/api/q/project/${pid}/chapter/${cid}/quiz/${qid}/scorecard`;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then((response) =>{ 
                if(response.status === 409){
                    navigate(`quiz/${qid}`)
                }
                return response.json()})
            .then((data) => {
                console.log(data);
                if (data !== null) {
                    navigate(`quiz/${qid}/review`)
                }
            }).catch((error) => console.error('Error fetching project:', error));
    }

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    }

    const handleCreateTopic = () => {
        const jwtToken = getCookie('jwtToken');
        const newTopic = { name: topicName };
        fetch('http://localhost:8080/api/t/project/' + project.pid + '/chapter/' + chapter.cid + '/topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newTopic),
        })
            .then(response => {
                if (response.status === 200) {
                    setOpenModal(false);
                    fetchTopics();
                } else {
                    navigate('/login');
                    console.error('Failed to create project');
                }
            });
    };

    useEffect(() => {
        fetchProject();
        fetchChapter();
        fetchTopics();
    }, []);

    return (
        <div className='Project-Page'>
            <div className='Abhyasika-Header'>
            <div className='Abhaysika-Header-Name'>Nirmitee | Abhyasika</div>
                <div className='Abhyasika-Header-Buttons'>
                    <div className='Abhyasika-Header-Home'><a href='http://localhost:3000/projects'>Home</a></div>
                    <div className='Abhyasika-Header-Logout' onClick={()=>{
                        document.cookie = 'jwtToken=; path=/;';
                    }}><a href='http://localhost:3000/login'>Logout</a></div>
                </div>
            </div>
            <div className='Project-List-Container'>
                <div className='Project-Details' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='Project-Details-Header'>
                        <h1 className='Project-Name'>{project ? project.name : 'Loading...'} &gt;&gt; {chapter ? chapter.name : ''}</h1>
                        <p className='Project-Description'>{chapter ? chapter.description : 'Loading...'}</p>
                    </div>
                    <div className='Chapter-Content'>
                        <div className='Chapter-Content-Topics'>
                            <div className='Topic-List-Header-Div'>
                                <div className='Topic-List-Header'>
                                    Topics
                                </div>
                                {editAccess && <div className='Topic-List-Create' onClick={()=>setOpenModal(true)}>
                                    Create
                                </div>}
                            </div>
                            <div className='Chapter-Content-Tables'>
                                <TableContainer component={Paper}>
                                    <Table >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Index</TableCell>
                                                <TableCell>Topic Name</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topics && topics.map((topic, index) => (
                                                <TableRow key={topic.tid} onClick={() => navigate(`/projects/${project.pid}/chapter/${chapter.cid}/topic/${topic.tid}`)}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{topic.name}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                        <div className='Chapter-Content-Quizzes'>
                            <div className='Topic-List-Header-Div'>
                                <div className='Topic-List-Header'>
                                    Quizzes
                                </div>
                                {editAccess && <div className='Topic-List-Create' onClick={()=>navigate(`/projects/${project.pid}/chapter/${chapter.cid}/setQuiz`)}>
                                    Create
                                </div>}
                            </div>

                            <div className='Chapter-Content-Tables'>
                                <TableContainer component={Paper}>
                                    <Table >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Index</TableCell>
                                                <TableCell>Quiz Name</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {quizzes && quizzes.map((quiz, index) => (
                                                <TableRow key={quiz.qid} onClick={() => fetchScoreCard(quiz.qid)}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{quiz.name}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Chatbox-Window' style={{ width: isChatOpen ? '25%' : '3%' }}>
                    <div className='Button-Window' onClick={handleChat} style={{ width: isChatOpen ? '12%' : '100%' }}>
                        AI
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
                    <h2 style={{ color: 'black' }}>Create New Topic</h2>
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
                        style={{ marginTop: 20, marginLeft: 30 }}
                    >
                        Save
                    </Button>
                </Box>
            </Modal>
        </div>
    )

}

export default ChapterDetails;