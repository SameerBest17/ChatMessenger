import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
export default function ChatHeader(props) {
   const{imageSrc,fullname,name,admin}= props.user
    return (
    
            <div className="chat-header clearfix">
                <img className ="profile-image" src={imageSrc?imageSrc:'//ssl.gstatic.com/accounts/ui/avatar_2x.png'} alt="" />
                <div className="chat-about">
                    <div className="chat-with">{fullname?fullname:name}</div>
                    <div className="chat-num-messages">Already {props.count} Messages </div>
                </div>
                { props.currentUser === admin? <button onClick={()=> props.delete(name)} className="delete-icon"> <DeleteIcon/></button>:null}
               
            </div>
    )
}
