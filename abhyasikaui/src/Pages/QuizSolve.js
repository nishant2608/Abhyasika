import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import AIChatWindow from '../Components/AIChatWindow';
import './QuizSet.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const QuizSolve = () => {
    const { pid, cid, qid } = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [anseredQuestions, setAnsweredQuestions] = useState([]);
    const navigate = useNavigate();

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const fetchQuiz = () => {
        const jwtToken = getCookie('jwtToken');
        const url = `http://43.204.91.223:8080/api/q/project/${pid}/chapter/${cid}/quiz/${qid}`;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
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
                setQuiz(data);
                const initialAnsweredQuestions = data.questions.map(question => ({
                    ...question,
                    chosenOption: null
                }));
                setAnsweredQuestions(initialAnsweredQuestions);
            }).catch((error) => console.error('Error fetching project:', error));
    }



    useEffect(() => {
        fetchQuiz();
    }, []);

    const handleSubmit = () => {
        anseredQuestions.forEach((question, index) => {
            switch (question.chosenOption) {
                case 'option1':
                    question.chosenOption = question.option1;
                    break;
                case 'option2':
                    question.chosenOption = question.option2;
                    break;
                case 'option3':
                    question.chosenOption = question.option3;
                    break;
                case 'option4':
                    question.chosenOption = question.option4;
                    break;
                default:
                    question.chosenOption = null;
                    break;
            }
        });
        console.log(anseredQuestions);
        const jwtToken = getCookie('jwtToken');
        const url = `http://43.204.91.223:8080/api/q/project/${pid}/chapter/${cid}/quiz/${qid}/submit`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(anseredQuestions)
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
                if (data !== null) {
                    navigate(`review`)
                }
            }).catch((error) => console.error('Error fetching project:', error));
    };

    return (
        <div className="Project-Page">
            <div className='Abhyasika-Header'>
                <div className='Abhaysika-Header-Name'>Nirmitee | Abhyasika</div>
                <div className='Abhyasika-Header-Buttons'>
                    <div className='Abhyasika-Header-Home'><a href='/projects'>Home</a></div>
                    <div className='Abhyasika-Header-Logout' onClick={() => {
                        document.cookie = 'jwtToken=; path=/;';
                    }}><a href='/login'>Logout</a></div>
                </div>
            </div>
            <div className="Project-List-Container">
                {quiz && <div className='Project-Details' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='QuizSet-Header'>
                        <div className='Quiz-Create'>Solve Quiz</div>
                        <div className='Quiz-Save' onClick={handleSubmit}>Submit</div>
                    </div>
                    <div className='QuizSet-Info'>
                        <div className='QuizSet-Name'>
                            {quiz.name}
                        </div>
                        <div className='QuizSet-Total-Minutes'>
                            {quiz.totalMinutes} minutes
                        </div>
                        <div className='QuizSet-Negative-Marking'>
                            Negative Marking: {quiz.negativeMarking ? 'Yes' : 'No'}
                        </div>
                    </div>
                    <div className='QuizSet-Questions'>
                        <div className='QuizSet-Questions-Header'>
                            <div>Questions</div>
                        </div>
                        <div className='QuizSet-Questions-List'>
                            {anseredQuestions.map((question, index) => (
                                <div key={index} className='QuizSet-Questions-Question'>
                                    <div className='QuizSet-Question-Index'>{index + 1}</div>
                                    <div className='QuizSet-Question-Content'>
                                        <div className='QuizSet-Question-String'>
                                            {question.questionString}
                                        </div>
                                        <div className='QuizSet-Options'>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.chosenOption === 'option1'} onChange={() => {
                                                    const newAnsweredQuestions = [...anseredQuestions];
                                                    newAnsweredQuestions[index].chosenOption = 'option1';
                                                    setAnsweredQuestions(newAnsweredQuestions);
                                                }} />
                                                <label>Option 1:</label>
                                                {question.option1}
                                            </div>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.chosenOption === 'option2'} onChange={() => {
                                                    const newAnsweredQuestions = [...anseredQuestions];
                                                    newAnsweredQuestions[index].chosenOption = 'option2';
                                                    setAnsweredQuestions(newAnsweredQuestions);
                                                }} />
                                                <label>Option 2:</label>
                                                {question.option2}
                                            </div>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.chosenOption === 'option3'} onChange={() => {
                                                    const newAnsweredQuestions = [...anseredQuestions];
                                                    newAnsweredQuestions[index].chosenOption = 'option3';
                                                    setAnsweredQuestions(newAnsweredQuestions);
                                                }} />
                                                <label>Option 3:</label>
                                                {question.option3}
                                            </div>
                                            <div className='Option-Cell'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.chosenOption === 'option4'} onChange={() => {
                                                    const newAnsweredQuestions = [...anseredQuestions];
                                                    newAnsweredQuestions[index].chosenOption = 'option4';
                                                    setAnsweredQuestions(newAnsweredQuestions);
                                                }} />
                                                <label>Option 4:</label>
                                                {question.option4}
                                            </div>
                                        </div>

                                    </div>
                                    <div className='QuizSet-Question-Delete'><IconButton color='secondary' onClick={() => {
                                        const newAnsweredQuestions = [...anseredQuestions];
                                        newAnsweredQuestions[index].chosenOption = null;
                                        setAnsweredQuestions(newAnsweredQuestions);
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}
                <div className='Chatbox-Window' style={{ width: isChatOpen ? '25%' : '3%' }}>
                    <div className='Button-Window' onClick={handleChat} style={{ width: isChatOpen ? '12%' : '100%' }}>
                        AI
                    </div>
                    <div className='Chat-Window' style={{ width: isChatOpen ? '88%' : '0%' }}>
                        {isChatOpen && <AIChatWindow />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizSolve;