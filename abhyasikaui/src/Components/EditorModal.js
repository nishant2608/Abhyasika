import { useEffect, useState } from "react"
import './EditorModal.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const EditorModal = ({ pid,handleClose }) => {
    const [project, setProject] = useState(null);
    const [newEditors, setNewEditors] = useState([]);
    const [queryEditors, setQueryEditors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchTerm(query);
        if(query.length > 0) {
            const jwtToken = getCookie('jwtToken');
            const url = 'http://localhost:8080/user/query?username=' + query;
            fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setQueryEditors(data);
                }).catch((error) => console.error('Error fetching users:', error));
        }
            
    }

    const saveEditors = () =>{
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/v1/user/project/' + pid + '/addEditors';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newEditors)
        })
        .then((response)=>{
            if(response.status===200){
                handleClose();
            }
            else{
                console.log("error updating the project.")
            }
        })
    }

    const removeFromList = (index) => {
        const updatedEditors = [...newEditors];
        updatedEditors.splice(index, 1);
        setNewEditors(updatedEditors);
    }

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
            }).catch((error) => console.error('Error fetching project:', error));
    };


    useEffect(() => {
        console.log('Fetching project');
        fetchProject();
    }, []);

    const addToList = (editor) => {
        setNewEditors([...newEditors, editor]);
    }

    return (
        <div className="Editor-Modal">
            <div className="Editor-Modal-Header">Add Editor Modal</div>
            <div className="Editor-Modal-Content">
                <div className="Editor-Modal-Content-Left">
                    <h2>New users to be added as editors:</h2>
                    {newEditors ? newEditors.map((editor, index) => {
                        return <div className="editor-modal-tile" key={index}>{editor.username}
                        <IconButton color="secondary" onClick={() => removeFromList(index)}>
                                    <DeleteIcon />
                                </IconButton>
                                </div>
                    }) : <></>}
                {newEditors.length>0 ? <div className="Editor-Save-Button" onClick={saveEditors}>Save</div>:<></>}
                </div>
                <div className="Editor-Modal-Content-Right">
                    <div className="search-title">Search for users to add:</div>
                    <input className="editor-search" type="search" placeholder="Search for editors" value={searchTerm} onChange={handleSearch} />
                    <div className="editor-list">
                        {queryEditors ? queryEditors.map((editor, index) => {
                            return <div className="editor-modal-tile" key={index} onClick={()=>{addToList(editor)}}>{editor.username}</div>
                        }) : <></>}
                        </div>
                </div>
            </div>
        </div>
    )
}

export default EditorModal;