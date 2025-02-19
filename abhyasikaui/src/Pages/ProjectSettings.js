import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ProjectSettings.css';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { Box, TextField, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import EditorModal from "../Components/EditorModal";
import ViewerModal from "../Components/ViewerModal";
import DeleteIcon from '@mui/icons-material/Delete';
import EditorRemovalModal from "../Components/EditorRemovalModal";
import ViewerRemovalModal from "../Components/ViewerRemovalModal";
import AIChatWindow from '../Components/AIChatWindow';

const ProjectSettings = () => {
    const {pid} = useParams();
    const [isChatOpen, setChatOpen] = useState(false);
    const [project, setProject] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [openPublicModal, setOpenPublicModal] = useState(false);
    const [openEditorModal, setOpenEditorModal] = useState(false);
    const [openViewerModal, setOpenViewerModal] = useState(false);
    const [removingEditor, setRemovingEditor] =useState(null);
    const [removingViewer, setRemovingViewer] = useState(null);
    const navigate = useNavigate();
    


    const handleChat = () => {
        setChatOpen(!isChatOpen);
    };

    const handleEdit =() =>{
        setProjectName(project.name);
        setProjectDescription(project.description);
        setOpenEditModal(true);
    }

    const handleConfirm = () => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/v1/user/project/' + pid + '/updatePublic';
        const updatedProject = {
            public: !project.public
        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(updatedProject)
        }).then((response) => {
            if (response.status === 200) {
                setOpenPublicModal(false);
                fetchProject();
            } else {
                navigate('/login');
                console.error('Failed to update project');
            }
        });
    };


    const handleUpdateProject = () => {
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/v1/user/project/' + pid;
        const updatedProject = {
            name: projectName,
            description: projectDescription
        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(updatedProject)
        }).then((response) => {
            if (response.status === 200) {
                setOpenEditModal(false);
                fetchProject();
            } else {
                navigate('/login');
                console.error('Failed to update project');
            }
        });
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
            }).catch((error) => console.error('Error fetching project:', error));
    };

    const handleEditorModal = () =>{
        setOpenEditorModal(false);
        fetchProject();
    }

    const handleViewerModal = ()=>{
        setOpenViewerModal(false);
        fetchProject();
    }

    const handleRemovalModal =() =>{
        setRemovingEditor(null);
        setRemovingViewer(null);
        fetchProject();
    }




    useEffect(() => {
        console.log('Fetching project');
        fetchProject();
    },[]);

    return (
        <div className='Project-Page'>
            <div className='Abhyasika-Header'>
            <div className='Abhaysika-Header-Name'>Nirmitee | Abhyasika</div>
                <div className='Abhyasika-Header-Buttons'>
                    <div className='Abhyasika-Header-Home'><a href='/projects'>Home</a></div>
                    <div className='Abhyasika-Header-Logout' onClick={()=>{
                        document.cookie = 'jwtToken=; path=/;';
                    }}><a href='/login'>Logout</a></div>
                </div>
            </div>
            <div className='Project-List-Container'>
                <div className='Project-Settings' style={{ width: isChatOpen ? '75%' : '97%', height: '100%' }}>
                    <div className='Project-Settings-Header'>
                        <h1 className='Project-Name' style={{marginLeft: '1em'}}>Settings</h1>
                    </div>
                    {project?<div className='Project-Settings-Content'>
                        <div className="Project-Settings-Name">
                            <div className="Project-Settings-Name-Header">Project Name</div>
                            <div className="Project-Settings-Name-Box">{project.name}</div>
                            <IconButton color="primary" onClick={handleEdit}> <EditIcon /></IconButton>
                        </div>
                        <div className="Project-Settings-Description">
                            <div className="Project-Settings-Description-Header">Project Description</div>
                            <div className="Project-Settings-Description-Box">{project.description}</div>
                            <IconButton color="primary" onClick={handleEdit}> <EditIcon /></IconButton>
                        </div>
                        <div className="Project-Settings-Privacy">
                            <div className="Project-Settings-Name-Header">Privacy</div>
                            <div className="Project-Settings-Name-Box">{project.public ? 'Public' : 'Private'}</div>
                            <IconButton color="primary" onClick={()=>{
                                setOpenPublicModal(true);
                            }}> <EditIcon /></IconButton>
                        </div>
                        <div className="Project-Settings-Editors">
                            <div className="Project-Settings-Name-Header">Editors</div>
                            <div className="Project-Settings-Editors-Box">
                                {project.editors? project.editors.map((editor,index)=>{
                                    return <div className="editor-tile" key={index}>{editor.username}
                                    <IconButton color="secondary" onClick={() => setRemovingEditor(editor)}>
                                    <DeleteIcon />
                                </IconButton></div>
                                }):<></>}
                            </div>
                            <IconButton color="primary" onClick={()=>{
                                setOpenEditorModal(true);
                            }}> <EditIcon /></IconButton>
                        </div>
                        <div className="Project-Settings-Viewers">
                            <div className="Project-Settings-Name-Header">Viewers</div>
                            <div className="Project-Settings-Viewers-Box">
                            {project.viewers? project.viewers.map((viewer,index)=>{
                                    return <div className="editor-tile" key={index}>{viewer.username}
                                    <IconButton color="secondary" onClick={() => setRemovingViewer(viewer)}>
                                    <DeleteIcon />
                                </IconButton></div>
                                }):<></>}
                            </div>
                            <IconButton color="primary" onClick={()=>{
                                setOpenViewerModal(true);
                            }}> <EditIcon /></IconButton>
                        </div>
                    </div>: <h1>Loading...</h1>}
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
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
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
            <h2 style={{color:'black'}}>Update Project</h2>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProject}
              style={{ marginTop: 20, marginLeft: 30 }}
            >
              Save
            </Button>
          </Box>
        </Modal>
        <Modal
                open={openPublicModal}
                onClose={() => setOpenPublicModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{ padding: '2em', backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '30%' }}>
                    <Typography variant="h6" id="alert-dialog-title" style={{color:"black"}}>{"Change Project Privacy"}</Typography>
                    <Typography variant="body1" id="alert-dialog-description" style={{color:"black"}}>
                        Are you sure you want to switch the project from {project && project.public ? 'Public to Private' : 'Private to Public'}?
                    </Typography>
                    <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setOpenPublicModal(false)} color="secondary">Cancel</Button>
                        <Button onClick={handleConfirm} color="primary" autoFocus>Confirm</Button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={openEditorModal}
                onClose={() => setOpenEditorModal(false)}
                >
                <EditorModal pid={pid} handleClose={handleEditorModal}/>
                </Modal>

            <Modal
                open={openViewerModal}
                onClose={()=> setOpenViewerModal(false)}
            >
                <ViewerModal pid={pid} handleClose={handleViewerModal} />
            </Modal>
            <Modal
            open={removingEditor!==null}
            onClose={()=>setRemovingEditor(null)}>
                {removingEditor? <EditorRemovalModal pid={pid} editor={removingEditor} handleClose={handleRemovalModal}/>:<></>}
            </Modal>
            <Modal
            open={removingViewer!==null}
            onClose={()=>setRemovingViewer(null)}>
                {removingViewer? <ViewerRemovalModal pid={pid} viewer={removingViewer} handleClose={handleRemovalModal}/>:<></>}
            </Modal>
        </div>
    )
}

export default ProjectSettings;