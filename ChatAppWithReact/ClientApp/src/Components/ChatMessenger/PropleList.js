import React from 'react'

export default function PropleList(props) {
//    console.log(props.users);
    return (
        <div className="people-list" id="people-list">
            {/* <div className="search">
                <input type="text" placeholder="search" />
                <i className="fa fa-search"></i>
            </div> */}
            <div className="room-action-Button">
                <button onClick={props.create}>Create Room</button>
            </div>
            <div className="Text-Lable ">
            <label style={{textAlign:'center'}}> Users List </label>
            </div>
            <ul className="list">
                {props.users.map((user,i) => (
                    <li key={i} onClick={()=>props.onSelect(user)} className="user clearfix">
                        <img className ="profile-image" src={user.imageSrc} alt="avatar" />
                        <div className="about">
                            <div className="name">{user.fullname}</div>
                            <div className="status">
                                {props.active[user.username]? <i className="fa fa-circle online"> online</i>:<i className="fa fa-circle offline"> offline</i>}
                               
                         </div>
                        </div>
                    </li>
                ))} 

            </ul>
        </div>

    )
}


