import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AIChatWindow from '../Components/AIChatWindow';
import TextEditor from './TextEditor';
import './TopicDetails.css';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

const TopicDetails = () => {
    const { pid, cid, tid } = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [editAccess, setEditAccess] = useState(false);
    const [project, setProject] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [topic, setTopic] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [negativeMarking, setNegativeMarking] = useState(false);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [quizName, setQuizName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [qid, setQid] = useState('');

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

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
            }).catch((error) => console.error('Error fetching project:', error));
    };

    const fetchTopic = () => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/t/project/' + pid + '/chapter/' + cid + '/topic/' + tid;
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
                setTopic(data);
            }).catch((error) => console.error('Error fetching chapters:', error));
    };

    const handleCreateQuiz = () => {
        setLoading(true);
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:5000/post/quiz';
        let messages = [];
        if (totalMinutes === 0 || totalMinutes > 180) {
            setTotalMinutes(180);
        }
        if (totalQuestions === 0 || totalQuestions > 20) {
            setTotalQuestions(20);
        }
        messages.push({
            role: 'system',
            content: `Generate a quiz consisting of ${totalQuestions <= 0 || totalQuestions > 20 ? 20 : totalQuestions} multiple choice questions on the given content. Correct option should be the exact string match of the correct answer`
        });
        messages.push({
            role: 'user',
            content: `${topic.content}`
        });
        const payload = {
            messages: messages
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(payload)
        })
        .then((response) => {
            if(response.status===401){
                navigate('/login')}
                else{
                    return response.json()}
                })
            .then((data) => {
                console.log(data);
                const quiz = {
                    name: quizName,
                    negativeMarking: negativeMarking,
                    totalMinutes: totalMinutes,
                    questions: data.questions
                };
                const jwtToken = getCookie('jwtToken');
                const url = `http://localhost:8080/api/q/project/${pid}/chapter/${cid}/quiz`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`
                    },
                    body: JSON.stringify(quiz)
                })
                .then((response) => {
                    if(response.status===401){
                        navigate('/login')}
                        else{
                            return response.json()}
                        })
                    .then((data) => {
                        console.log(data);
                        setQid(data.qid);
                        setLoading(false);
                        return data.qid;
                    })
                    .then((quizId) => navigate(`/projects/${pid}/chapter/${cid}/quiz/${quizId}`))
                    .catch((error) => {
                        console.error('Error fetching project:', error);
                        setLoading(false);
                    });
            }).catch((error) => {
                console.error('Error fetching project:', error);
                setLoading(false);
            });
    };

    const handleCloseModal = () => {
        handleCreateQuiz();
        setOpenModal(false);
    };

    useEffect(() => {
        fetchProject();
        fetchChapter();
        fetchTopic();
    }, []);

    return (
        <div className="Project-Page">
            <div className='Abhyasika-Header'>
            <div className='Abhaysika-Header-Name'>Nirmitee | Abhyasika</div>
                <div className='Abhyasika-Header-Buttons'>
                    <div className='Abhyasika-Header-Home'><a href='http://localhost:3000/projects'>Home</a></div>
                    <div className='Abhyasika-Header-Logout' onClick={()=>{
                        document.cookie = 'jwtToken=; path=/;';
                    }}><a href='http://localhost:3000/login'>Logout</a></div>
                </div>
            </div>
            <div className="Project-List-Container">
                <div className='Project-Details' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='Topic-Details-Header'>
                        <h1 className='Project-Name'>{project ? project.name : 'Loading...'} &gt;&gt; {chapter ? chapter.name : ''} &gt;&gt; {topic && topic.name}</h1>
                        {editAccess && <div className='AI-Quiz-Button' onClick={() => setOpenModal(true)}>Quiz AI</div>}
                    </div>
                    <div className='Topic-Content'>
                        {topic && <TextEditor topic={topic} pid={pid} cid={cid} editAccess={editAccess} />}
                    </div>
                </div>
                <div className='Chatbox-Window' style={{ width: isChatOpen ? '25%' : '3%' }}>
                    <div className='Button-Window' onClick={handleChat} style={{ width: isChatOpen ? '12%' : '100%' }}>
                        AI
                    </div>
                    <div className='Chat-Window' style={{ width: isChatOpen ? '88%' : '0%' }}>
                        {isChatOpen && <AIChatWindow />}
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
                    <h2 style={{ color: 'black' }}>Generate Quiz With AI</h2>
                    <TextField
                        label="Quiz Name"
                        variant="outlined"
                        fullWidth
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        margin="normal"
                    />
                    <label style={{ color: 'black' }}>Total Questions</label>
                    <input
                        type='number'
                        label="Total questions"
                        variant="outlined"
                        fullWidth
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(e.target.value)}
                        margin="normal"
                    />
                    <br />
                    <label style={{ color: 'black' }}>Total Minutes</label>
                    <input
                        type='number'
                        label="Total minutes"
                        variant="outlined"
                        fullWidth
                        value={totalMinutes}
                        onChange={(e) => setTotalMinutes(e.target.value)}
                        margin="normal"
                    />
                    <br />
                    <Checkbox
                        checked={negativeMarking}
                        onChange={(e) => setNegativeMarking(e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <span style={{ color: 'black' }}>Negative Marking</span>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseModal}
                        style={{ marginTop: 20, marginLeft: 30 }}
                    >
                        Save
                    </Button>
                </Box>
            </Modal>
            {loading && (
                <div className="LoaderOverlay">
                    <CircularProgress />
                </div>
            )}
        </div>
    );
}

export default TopicDetails;