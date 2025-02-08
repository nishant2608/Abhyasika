import './RemovalModal.css'

const ViewerRemovalModal =({pid,viewer,handleClose})=>{

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const removeViewer = () =>{
        let removalArray = '[' + JSON.stringify(viewer) + ']';
        console.log(removalArray);
        const jwtToken = getCookie('jwtToken');
        const url = 'http://localhost:8080/api/v1/user/project/' + pid + '/removeViewers';
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
            <div className="Removal-text">Are you sure you want to remove {viewer.username} as a viewer?</div>
            <div className="Removal-Confirm-Button" onClick={removeViewer}>Yes</div>
            <div className="Removal-Reject-Button" onClick={handleClose}>Cancel</div>
        </div>
    )
}

export default ViewerRemovalModal;