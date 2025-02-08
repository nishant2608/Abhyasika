import { useEffect, useState } from "react"
import './EditorModal.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewerModal = ({ pid,handleClose }) => {
    const [project, setProject] = useState(null);
    const [newViewers, setNewViewers] = useState([]);
    const [queryViewers, setQueryViewers] = useState([]);
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
                    setQueryViewers(data);
                }).catch((error) => console.error('Error fetching users:', error));
        }
            
    }

    const saveViewers = () =>{
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/v1/user/project/' + pid + '/addViewers';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newViewers)
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
        const updatedViewers = [...newViewers];
        updatedViewers.splice(index, 1);
        setNewViewers(updatedViewers);
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

    const addToList = (viewer) => {
        setNewViewers([...newViewers, viewer]);
    }

    return (
        <div className="Editor-Modal">
            <div className="Editor-Modal-Header">Add Viewer Modal</div>
            <div className="Editor-Modal-Content">
                <div className="Editor-Modal-Content-Left">
                    <h2>New users to be added as viewers:</h2>
                    {newViewers ? newViewers.map((viewer, index) => {
                        return <div className="editor-modal-tile" key={index}>{viewer.username}
                        <IconButton color="secondary" onClick={() => removeFromList(index)}>
                                    <DeleteIcon />
                                </IconButton>
                                </div>
                    }) : <></>}
                {newViewers.length>0 ? <div className="Editor-Save-Button" onClick={saveViewers}>Save</div>:<></>}
                </div>
                <div className="Editor-Modal-Content-Right">
                    <div className="search-title">Search for users to add:</div>
                    <input className="editor-search" type="search" placeholder="Search for viewers" value={searchTerm} onChange={handleSearch} />
                    <div className="editor-list">
                        {queryViewers ? queryViewers.map((viewer, index) => {
                            return <div className="editor-modal-tile" key={index} onClick={()=>{addToList(viewer)}}>{viewer.username}</div>
                        }) : <></>}
                        </div>
                </div>
            </div>
        </div>
    )
}

export default ViewerModal;