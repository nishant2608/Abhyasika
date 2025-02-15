import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import AIChatWindow from '../Components/AIChatWindow';
import TextEditor from './TextEditor';
import './TopicDetails.css'

const TopicDetails = () => {

    const { pid, cid, tid} = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [editAccess, setEditAccess] = useState(false);
    const [project, setProject] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [topic, setTopic] = useState(null);

    const handleChat = () => {
        setIsChatOpen(!isChatOpen);
    }

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
            .then((response) => response.json())
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
            .then((response) => response.json())
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
            .then((response) => response.json())
            .then((data) => {
                setTopic(data);
            }).catch((error) => console.error('Error fetching chapters:', error));
    };

    useEffect(() => {
        fetchProject();
        fetchChapter();
        fetchTopic();
    }, []);

    return (
        <div className="Project-Page">
            <div className='Abhyasika-Header'>

            </div>
            <div className="Project-List-Container">
                <div className='Project-Details' style={{ width: isChatOpen ? '75%' : '97%' }}>
                    <div className='Project-Details-Header'>
                        <h1 className='Project-Name'>{project ? project.name : 'Loading...'} &gt;&gt; {chapter ? chapter.name : ''} &gt;&gt; {topic && topic.name}</h1>
                    </div>
                    <div className='Topic-Content'>
                      {topic &&  <TextEditor topic={topic} pid={pid} cid={cid} editAccess={editAccess}/>}
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
        </div>
    );
}

export default TopicDetails;