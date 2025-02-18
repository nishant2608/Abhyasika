import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import AIChatWindow from '../Components/AIChatWindow';
import './QuizSet.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const QuizReview = () => {
    const { pid, cid, qid } = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [scorecard, setScorecard] = useState(null);
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
        const url = `http://localhost:8080/api/q/project/${pid}/chapter/${cid}/quiz/${qid}/review`;
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
                setQuiz(data);
            }).catch((error) => console.error('Error fetching project:', error));
    }

    const fetchScoreCard = () => {
        const jwtToken = getCookie('jwtToken');
        const url = `http://localhost:8080/api/q/project/${pid}/chapter/${cid}/quiz/${qid}/scorecard`;
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
                setScorecard(data);
            }).catch((error) => console.error('Error fetching project:', error));
    }

    

    useEffect(() => {
        fetchQuiz();
        fetchScoreCard();
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
                {quiz && scorecard && <div className='Project-Details' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='QuizSet-Header'>
                        <div className='Quiz-Create'>Review Quiz</div>
                    </div>
                    <div className='QuizReview-Info'>
                        <div className='QuizReview-Name'>
                            {quiz.name}
                        </div>
                        <div className='QuizReview-Total-Minutes'>
                            {quiz.totalMinutes} minutes
                        </div>
                        <div className='QuizReview-Negative-Marking'>
                            Negative Marking: {quiz.negativeMarking ? 'Yes' : 'No'}
                        </div>
                        <div className='QuizReview-Score'>
                            Score: {scorecard.score}/{quiz.questions.length}
                            </div>
                        <div className='QuizReview-CorrectQuestions'>
                            Correct Questions: {scorecard.correctQuestions}
                            </div>
                    </div>
                    <div className='QuizReview-Questions'>
                        <div className='QuizSet-Questions-Header'>
                            <div>Leaderboard</div>
                            </div>
                            <div className='QuizReview-Leaderboard'>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Score</TableCell>
                                            <TableCell>Correct Questions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {quiz.leaderBoard.sort((a, b) => b.score - a.score).map((entry, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{entry.username}</TableCell>
                                                <TableCell>{entry.score}</TableCell>
                                                <TableCell>{entry.correctQuestions}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                                </div>
                        <div className='QuizSet-Questions-Header'>
                            <div>Questions</div>
                        </div>
                        <div className='QuizReview-Questions-List'>
                            {quiz.questions.map((question, index) => (
                                <div key={index} className='QuizReview-Questions-Question'>
                                    <div className='QuizSet-Question-Index' style={{backgroundColor:scorecard.chosenOptions[index]===question.correctOption && "green"}}>{index + 1}</div>
                                    <div className='QuizSet-Question-Content'>
                                        <div className='QuizSet-Question-String'>
                                            {question.questionString}
                                        </div>
                                        <div className='QuizSet-Options'>
                                            <div className='Option-Cell-Review'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.option1 === scorecard.chosenOptions[index]} />
                                                <label>Option 1:</label>
                                                {question.option1}
                                            </div>
                                            <div className='Option-Cell-Review'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.option2 === scorecard.chosenOptions[index]}  />
                                                <label>Option 2:</label>
                                                {question.option2}
                                            </div>
                                            <div className='Option-Cell-Review'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.option3 === scorecard.chosenOptions[index]} />
                                                <label>Option 3:</label>
                                                {question.option3}
                                            </div>
                                            <div className='Option-Cell-Review'>
                                                <input type='radio' name={`chosenOption-${index}`} checked={question.option4 === scorecard.chosenOptions[index]}  />
                                                <label>Option 4:</label>
                                                {question.option4}
                                            </div>
                                            <div className='Option-Cell-Review'>
                                                <label>Correct Option:</label>
                                                {question.correctOption}
                                                </div>
                                        </div>
                                        
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

export default QuizReview;