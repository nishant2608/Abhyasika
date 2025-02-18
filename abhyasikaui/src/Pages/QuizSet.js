import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import AIChatWindow from '../Components/AIChatWindow';
import './QuizSet.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import { Box, TextField, Button, CircularProgress } from '@mui/material';


const QuizSet = () => {
    const { pid, cid } = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [questions, setQuestions] = useState([{ questionString: '', option1: '', option2: '', option3: '', option4: '', correctOption: 'option1' }]);
    const [name, setName] = useState('');
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [negativeMarking, setNegativeMarking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [aiContent, setAiContent] = useState('');
    const navigate = useNavigate();

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const handleSave = () => {

        const jwtToken = getCookie('jwtToken');
        const url = `http://localhost:8080/api/q/project/${pid}/chapter/${cid}/quiz`;
        let formattedQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            let correctAnswer = '';
            switch (questions[i].correctOption) {
                case 'option1':
                    correctAnswer = questions[i].option1;
                    break;
                case 'option2':
                    correctAnswer = questions[i].option2;
                    break;
                case 'option3':
                    correctAnswer = questions[i].option3;
                    break;
                case 'option4':
                    correctAnswer = questions[i].option4;
                    break;
                default:
                    correctAnswer = questions[i].option1;
            }
            formattedQuestions.push({
                questionString: questions[i].questionString,
                option1: questions[i].option1,
                option2: questions[i].option2,
                option3: questions[i].option3,
                option4: questions[i].option4,
                correctOption: correctAnswer

            });
        }
        const newQuiz = {
            name: name,
            totalMinutes: totalMinutes,
            negativeMarking: negativeMarking,
            questions: formattedQuestions
        }

        fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuiz)
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate('/login')
                }
                else {
                    return response.json()
                }
            })
            .then((data) => {
                console.log(data);
                navigate(`/projects/${pid}/chapter/${cid}`);
            })
            .catch((error) => console.error('Error saving quiz:', error));
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
            content: `Generate a quiz consisting of ${totalQuestions <= 0 || totalQuestions > 20 ? 20 : totalQuestions} multiple choice questions on the given topic. Correct option should be the exact string match of the correct answer.`
        });
        messages.push({
            role: 'user',
            content: `${aiContent}`
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
                if (response.status === 401) {
                    navigate('/login')
                }
                else {
                    return response.json()
                }
            })
            .then((data) => {
                console.log(data);
                const quiz = {
                    name: name,
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
                        if (response.status === 401) {
                            navigate('/login')
                        }
                        else {
                            return response.json()
                        }
                    })
                    .then((data) => {
                        console.log(data);
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

    return (
        <div className="Project-Page">
            <div className='Abhyasika-Header'>
                <div className='Abhaysika-Header-Name'>Nirmitee | Abhyasika</div>
                <div className='Abhyasika-Header-Buttons'>
                    <div className='Abhyasika-Header-Home'><a href='http://localhost:3000/projects'>Home</a></div>
                    <div className='Abhyasika-Header-Logout' onClick={() => {
                        document.cookie = 'jwtToken=; path=/;';
                    }}><a href='http://localhost:3000/login'>Logout</a></div>
                </div>
            </div>
            <div className="Project-List-Container">
                <div className='Project-Details' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='QuizSet-Header'>
                        <div className='Quiz-Create'>Create Quiz</div>
                        <div className='Quiz-Action-Buttons'>
                            <div className='Quiz-Set-AI' onClick={() => setOpenModal(true)}>Quiz AI</div>
                            <div className='Quiz-Save' onClick={handleSave}>Save</div>
                        </div>
                        
                    </div>
                    <div className='QuizSet-Info'>
                        <div className='QuizSet-Name'>
                            <label className='QuizSet-Label'>Quiz Name</label>
                            <input className='QuizSet-Name-Input' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='QuizSet-Total-Minutes'>
                            <label className='QuizSet-Label'>Total Minutes</label>
                            <input type='number' value={totalMinutes} onChange={(e) => setTotalMinutes(e.target.value)} />
                        </div>
                        <div className='QuizSet-Negative-Marking'>
                            <label>Negative Marking</label>
                            <input type='checkbox' value={negativeMarking} onChange={(e) => setNegativeMarking(e.target.checked)} />
                        </div>
                    </div>
                    <div className='QuizSet-Questions'>
                        <div className='QuizSet-Questions-Header'>
                            <div>Questions</div>
                        </div>
                        <div className='QuizSet-Questions-List'>
                            {questions.map((question, index) => (
                                <div key={index} className='QuizSet-Questions-Question'>
                                    <div className='QuizSet-Question-Index'>{index + 1}</div>
                                    <div className='QuizSet-Question-Content'>
                                        <div className='QuizSet-Question-String'>
                                            <label className='QuizSet-Label'>Question</label>
                                            <textarea className='QuestionString' type='text' value={question.questionString} onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[index].questionString = e.target.value;
                                                setQuestions(newQuestions);
                                            }} />
                                        </div>
                                        <div className='QuizSet-Options'>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`correctOption-${index}`} checked={question.correctOption === 'option1'} onChange={() => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].correctOption = 'option1';
                                                    setQuestions(newQuestions);
                                                }} />
                                                <label>Option 1</label>
                                                <input type='text' value={question.option1} onChange={(e) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].option1 = e.target.value;
                                                    setQuestions(newQuestions);
                                                }} />
                                            </div>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`correctOption-${index}`} checked={question.correctOption === 'option2'} onChange={() => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].correctOption = 'option2';
                                                    setQuestions(newQuestions);
                                                }} />
                                                <label>Option 2</label>
                                                <input type='text' value={question.option2} onChange={(e) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].option2 = e.target.value;
                                                    setQuestions(newQuestions);
                                                }} />
                                            </div>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`correctOption-${index}`} checked={question.correctOption === 'option3'} onChange={() => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].correctOption = 'option3';
                                                    setQuestions(newQuestions);
                                                }} />
                                                <label>Option 3</label>
                                                <input type='text' value={question.option3} onChange={(e) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].option3 = e.target.value;
                                                    setQuestions(newQuestions);
                                                }} />
                                            </div>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`correctOption-${index}`} checked={question.correctOption === 'option4'} onChange={() => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].correctOption = 'option4';
                                                    setQuestions(newQuestions);
                                                }} />
                                                <label>Option 4</label>
                                                <input type='text' value={question.option4} onChange={(e) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[index].option4 = e.target.value;
                                                    setQuestions(newQuestions);
                                                }} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className='QuizSet-Question-Delete'><IconButton color='secondary' onClick={() => {
                                        const newQuestions = [...questions];
                                        newQuestions.splice(index, 1);
                                        setQuestions(newQuestions);
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                    </div>
                                </div>
                            ))}
                            <div className='QuizSet-Questions-Add' onClick={() => setQuestions([...questions, { questionString: '', option1: '', option2: '', option3: '', option4: '', correctOption: 'option1' }])}>
                                Add Question
                            </div>

                        </div>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    <br />
                    <label style={{ color: 'black' }}>Content/Topic</label>
                    <textarea style={{width:'100%'}} value={aiContent} onChange={(e) => setAiContent(e.target.value)} required/>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateQuiz}
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
    )
}

export default QuizSet;