import './RemovalModal.css'

const EditorRemovalModal =({pid,editor,handleClose})=>{

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const removeEditor = () =>{
        let removalArray = '[' + JSON.stringify(editor) + ']';
        console.log(removalArray);
        const jwtToken = getCookie('jwtToken');
        const url = 'http://43.204.91.223:8080/api/v1/user/project/' + pid + '/removeEditors';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: removalArray
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


    return(
        <div className="Removal-Modal">
            <div className="Removal-text">Are you sure you want to remove {editor.username} as an editor?</div>
            <div className="Removal-Confirm-Button" onClick={removeEditor}>Yes</div>
            <div className="Removal-Reject-Button" onClick={handleClose}>Cancel</div>
        </div>
    )
}

export default EditorRemovalModal;